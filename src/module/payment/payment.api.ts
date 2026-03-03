import { desc, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { createTRPCRouter, publicProcedure } from "@/core/api/api.methods";
import { db } from "@/core/db/db";
import { order, payment } from "@/core/db/db.schema";
import { STATUS } from "@/shared/config/api.config";
import { API_RESPONSE } from "@/shared/config/api.utils";
import { debugError } from "@/shared/utils/lib/logger.utils";
import { paymentContract, type Payment, type PaymentProviderMetadata } from "./payment.schema";

export const paymentRouter = createTRPCRouter({
  /**
   * Create a payment intent for an order
   */
  createIntent: publicProcedure
    .input(paymentContract.createIntent.input)
    .output(paymentContract.createIntent.output)
    .mutation(async ({ input }) => {
      try {
        const { orderId, provider } = input.body;

        const orderData = await db.query.order.findFirst({
          where: eq(order.id, orderId),
        });

        if (!orderData) {
          return API_RESPONSE(STATUS.FAILED, "Order not found", null);
        }

        const paymentId = uuidv4();

        // In a real app, this is where we'd call Stripe/Razorpay API
        // const intent = await stripe.paymentIntents.create({ ... });

        const [newPayment] = await db
          .insert(payment)
          .values({
            id: paymentId,
            orderId,
            provider,
            status: "pending",
            amount: orderData.grandTotal,
            currency: orderData.currency,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();

        const payload: Payment = {
          id: newPayment.id,
          orderId: newPayment.orderId,
          provider: newPayment.provider,
          status: newPayment.status,
          amount: newPayment.amount,
          currency: newPayment.currency ?? "INR",
          providerPaymentId: newPayment.providerPaymentId ?? undefined,
          providerMetadata: (newPayment.providerMetadata ?? undefined) as PaymentProviderMetadata | null | undefined,
          createdAt: newPayment.createdAt ?? undefined,
          updatedAt: newPayment.updatedAt ?? undefined,
        };

        return API_RESPONSE(STATUS.SUCCESS, "Payment intent created", payload);
      } catch (err) {
        debugError("PAYMENT:CREATE_INTENT:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error creating payment intent", null, err as Error);
      }
    }),

  /**
   * Confirm a payment
   */
  confirm: publicProcedure
    .input(paymentContract.confirm.input)
    .output(paymentContract.confirm.output)
    .mutation(async ({ input }) => {
      try {
        const { paymentId, providerPaymentId, status, metadata } = input.body;

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

        // If payment completed, update order status
        if (status === "completed") {
          await db
            .update(order)
            .set({ status: "paid", updatedAt: new Date() })
            .where(eq(order.id, updatedPayment.orderId));
        }

        const payload: Payment = {
          id: updatedPayment.id,
          orderId: updatedPayment.orderId,
          provider: updatedPayment.provider,
          status: updatedPayment.status,
          amount: updatedPayment.amount,
          currency: updatedPayment.currency ?? "INR",
          providerPaymentId: updatedPayment.providerPaymentId ?? undefined,
          providerMetadata: (updatedPayment.providerMetadata ?? undefined) as
            | PaymentProviderMetadata
            | null
            | undefined,
          createdAt: updatedPayment.createdAt ?? undefined,
          updatedAt: updatedPayment.updatedAt ?? undefined,
        };

        return API_RESPONSE(STATUS.SUCCESS, "Payment confirmed", payload);
      } catch (err) {
        debugError("PAYMENT:CONFIRM:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error confirming payment", null, err as Error);
      }
    }),

  /**
   * Get payment status for an order
   */
  getStatus: publicProcedure
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
