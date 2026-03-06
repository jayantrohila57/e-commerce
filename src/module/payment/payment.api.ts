import { desc, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { createTRPCRouter, customerProcedure } from "@/core/api/api.methods";
import { db } from "@/core/db/db";
import { order, payment } from "@/core/db/db.schema";
import { razorpay } from "@/core/payment/razorpay.client";
import { buildRazorpayOrderOptions } from "@/core/payment/razorpay.options";
import { verifyCheckoutSignature } from "@/core/payment/razorpay.verify";
import { notifyOrderConfirmation } from "@/shared/components/mail/notification.service";
import { STATUS } from "@/shared/config/api.config";
import { API_RESPONSE } from "@/shared/config/api.utils";
import { serverEnv } from "@/shared/config/env.server";
import { debugError } from "@/shared/utils/lib/logger.utils";
import { type Payment, type PaymentProviderMetadata, paymentContract } from "./payment.schema";

function toPaymentDto(row: {
  id: string;
  orderId: string;
  provider: string;
  status: string;
  amount: number;
  currency: string | null;
  providerPaymentId: string | null;
  providerMetadata: unknown;
  createdAt: Date | null;
  updatedAt: Date | null;
}): Payment {
  return {
    id: row.id,
    orderId: row.orderId,
    provider: row.provider as Payment["provider"],
    status: row.status as Payment["status"],
    amount: row.amount,
    currency: row.currency ?? "INR",
    providerPaymentId: row.providerPaymentId ?? undefined,
    providerMetadata: (row.providerMetadata ?? undefined) as PaymentProviderMetadata | null | undefined,
    createdAt: row.createdAt ?? undefined,
    updatedAt: row.updatedAt ?? undefined,
  };
}

export const paymentRouter = createTRPCRouter({
  /**
   * Create a payment intent for an order. For Razorpay, creates a Razorpay order and returns
   * razorpayOrderId for checkout.js. Amount is taken from order.grandTotal (paise).
   */
  createIntent: customerProcedure
    .input(paymentContract.createIntent.input)
    .output(paymentContract.createIntent.output)
    .mutation(async ({ input, ctx }) => {
      try {
        const { orderId, provider } = input.body;
        const userId = ctx.user.id;

        const orderData = await db.query.order.findFirst({
          where: eq(order.id, orderId),
        });

        if (!orderData) {
          return API_RESPONSE(STATUS.FAILED, "Order not found", null);
        }

        if (orderData.userId && orderData.userId !== userId) {
          return API_RESPONSE(STATUS.FAILED, "Unauthorized", null);
        }

        if (orderData.status !== "pending") {
          return API_RESPONSE(STATUS.FAILED, "Order is not in pending state", null);
        }

        const paymentId = uuidv4();
        let razorpayOrderId: string | undefined;

        if (provider === "razorpay") {
          const options = buildRazorpayOrderOptions({
            amount: orderData.grandTotal,
            currency: orderData.currency ?? "INR",
            receipt: orderId,
            notes: { orderId },
          });
          const rzOrder = await razorpay.orders.create(options);
          razorpayOrderId = rzOrder.id;
        }

        const [newPayment] = await db
          .insert(payment)
          .values({
            id: paymentId,
            orderId,
            provider,
            status: "pending",
            amount: orderData.grandTotal,
            currency: orderData.currency,
            providerMetadata: razorpayOrderId != null ? { razorpayOrderId } : undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();

        const payload = toPaymentDto(newPayment);

        return API_RESPONSE(STATUS.SUCCESS, "Payment intent created", {
          payment: payload,
          razorpayOrderId,
        });
      } catch (err) {
        debugError("PAYMENT:CREATE_INTENT:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error creating payment intent", null, err as Error);
      }
    }),

  /**
   * Confirm a payment. For Razorpay, razorpayOrderId/razorpayPaymentId/razorpaySignature
   * must be provided; signature is verified before updating. Idempotent if already completed.
   */
  confirm: customerProcedure
    .input(paymentContract.confirm.input)
    .output(paymentContract.confirm.output)
    .mutation(async ({ input, ctx }) => {
      try {
        const {
          paymentId,
          providerPaymentId,
          status,
          metadata,
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
        } = input.body;

        const paymentRow = await db.query.payment.findFirst({
          where: eq(payment.id, paymentId),
          with: { order: true },
        });

        if (!paymentRow || !paymentRow.order) {
          return API_RESPONSE(STATUS.FAILED, "Payment record not found", null);
        }

        if (paymentRow.order.userId && paymentRow.order.userId !== ctx.user.id) {
          return API_RESPONSE(STATUS.FAILED, "Unauthorized", null);
        }

        if (paymentRow.status === "completed") {
          return API_RESPONSE(STATUS.SUCCESS, "Payment already confirmed", toPaymentDto(paymentRow));
        }

        if (paymentRow.provider === "razorpay") {
          if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
            return API_RESPONSE(STATUS.FAILED, "Razorpay verification fields required", null);
          }
          const valid = verifyCheckoutSignature(
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            serverEnv.RAZORPAY_API_SECRET,
          );
          if (!valid) {
            return API_RESPONSE(STATUS.FAILED, "Invalid payment signature", null);
          }
        }

        const [updatedPayment] = await db
          .update(payment)
          .set({
            status,
            providerPaymentId,
            providerMetadata: metadata,
            updatedAt: new Date(),
          })
          .where(eq(payment.id, paymentId))
          .returning();

        if (!updatedPayment) {
          return API_RESPONSE(STATUS.FAILED, "Payment record not found", null);
        }

        if (status === "completed") {
          await db
            .update(order)
            .set({ status: "paid", updatedAt: new Date() })
            .where(eq(order.id, updatedPayment.orderId));

          await notifyOrderConfirmation(updatedPayment.orderId);
        }

        return API_RESPONSE(STATUS.SUCCESS, "Payment confirmed", toPaymentDto(updatedPayment));
      } catch (err) {
        debugError("PAYMENT:CONFIRM:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error confirming payment", null, err as Error);
      }
    }),

  /**
   * Get payment status for an order
   */
  getStatus: customerProcedure
    .input(paymentContract.getStatus.input)
    .output(paymentContract.getStatus.output)
    .query(async ({ input }) => {
      try {
        const { orderId } = input.params;

        const data = await db.query.payment.findMany({
          where: eq(payment.orderId, orderId),
          orderBy: (payment, { desc }) => [desc(payment.createdAt)],
        });

        const payload: Payment[] = data.map((p) => ({
          id: p.id,
          orderId: p.orderId,
          provider: p.provider,
          status: p.status,
          amount: p.amount,
          currency: p.currency ?? "INR",
          providerPaymentId: p.providerPaymentId ?? undefined,
          providerMetadata: (p.providerMetadata ?? undefined) as PaymentProviderMetadata | null | undefined,
          createdAt: p.createdAt ?? undefined,
          updatedAt: p.updatedAt ?? undefined,
        }));

        return API_RESPONSE(STATUS.SUCCESS, "Payment status retrieved", payload);
      } catch (err) {
        debugError("PAYMENT:GET_STATUS:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error retrieving payment status", [], err as Error);
      }
    }),
});
