import { eq, sql } from "drizzle-orm";
import { db } from "@/core/db/db";
import { order, payment } from "@/core/db/db.schema";
import { razorpay } from "@/core/payment/razorpay.client";
import { verifyCheckoutSignature } from "@/core/payment/razorpay.verify";
import type { PaymentProviderMetadata } from "@/module/payment/payment.schema";
import { notifyOrderConfirmation } from "@/shared/components/mail/notification.service";
import { serverEnv } from "@/shared/config/env.server";

export type RazorpayCompleteResult =
  | { ok: true; orderId: string }
  | {
      ok: false;
      reason:
        | "not_found"
        | "invalid_signature"
        | "wrong_order"
        | "wrong_payment"
        | "forbidden"
        | "amount_mismatch"
        | "provider_error"
        | "payment_not_successful";
    };

type RazorpayPaymentEntity = {
  status?: string;
  amount?: number;
  order_id?: string;
};

/**
 * Mark app payment + order after Razorpay checkout signature verification and server-side payment fetch.
 * Status is derived only from Razorpay — never from the client.
 */
export async function completeRazorpayPaymentAfterVerification(input: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  /** When set, must match the payment row's id (tRPC confirm). */
  paymentId?: string;
  /** When set, must match the payment row's orderId (callback query guard). */
  expectedOrderId?: string;
  /** When set, order.userId must match (skips when order has no userId). */
  authenticatedUserId?: string;
  /** Optional client metadata merged into providerMetadata after verification (non-authoritative). */
  extraMetadata?: Record<string, unknown> | null;
}): Promise<RazorpayCompleteResult> {
  const {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    paymentId,
    expectedOrderId,
    authenticatedUserId,
    extraMetadata,
  } = input;

  const valid = verifyCheckoutSignature(
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    serverEnv.RAZORPAY_API_SECRET,
  );
  if (!valid) return { ok: false, reason: "invalid_signature" };

  const paymentRow = paymentId
    ? await db.query.payment.findFirst({
        where: eq(payment.id, paymentId),
        with: { order: true },
      })
    : await db.query.payment.findFirst({
        where: sql`${payment.providerMetadata}->>'razorpayOrderId' = ${razorpayOrderId}`,
        with: { order: true },
      });

  if (!paymentRow || !paymentRow.order) return { ok: false, reason: "not_found" };

  if (paymentRow.provider !== "razorpay") return { ok: false, reason: "wrong_payment" };

  const meta = paymentRow.providerMetadata as PaymentProviderMetadata | null | undefined;
  const storedOrderId =
    meta && typeof meta === "object" && "razorpayOrderId" in meta ? meta.razorpayOrderId : undefined;
  if (typeof storedOrderId === "string" && storedOrderId !== razorpayOrderId) {
    return { ok: false, reason: "wrong_payment" };
  }

  if (expectedOrderId && paymentRow.orderId !== expectedOrderId) {
    return { ok: false, reason: "wrong_order" };
  }

  if (authenticatedUserId && paymentRow.order.userId && paymentRow.order.userId !== authenticatedUserId) {
    return { ok: false, reason: "forbidden" };
  }

  if (paymentRow.status === "completed") {
    return { ok: true, orderId: paymentRow.orderId };
  }

  let rzPayment: RazorpayPaymentEntity;
  try {
    rzPayment = (await razorpay.payments.fetch(razorpayPaymentId)) as RazorpayPaymentEntity;
  } catch {
    return { ok: false, reason: "provider_error" };
  }

  if (rzPayment.order_id && rzPayment.order_id !== razorpayOrderId) {
    return { ok: false, reason: "wrong_payment" };
  }

  if (typeof rzPayment.amount === "number" && rzPayment.amount !== paymentRow.amount) {
    return { ok: false, reason: "amount_mismatch" };
  }

  const rzStatus = rzPayment.status ?? "";
  const success = rzStatus === "authorized" || rzStatus === "captured";
  const failed = rzStatus === "failed";

  const existingMeta = (paymentRow.providerMetadata ?? {}) as Record<string, unknown>;
  const mergedMeta: PaymentProviderMetadata = {
    ...existingMeta,
    razorpayOrderId,
    razorpayPaymentId,
    verifiedAt: new Date().toISOString(),
    razorpayStatus: rzStatus,
    ...(extraMetadata && typeof extraMetadata === "object" ? extraMetadata : {}),
  };

  if (failed) {
    await db
      .update(payment)
      .set({
        status: "failed",
        providerPaymentId: razorpayPaymentId,
        providerMetadata: mergedMeta,
        updatedAt: new Date(),
      })
      .where(eq(payment.id, paymentRow.id));
    return { ok: false, reason: "payment_not_successful" };
  }

  if (!success) {
    return { ok: false, reason: "payment_not_successful" };
  }

  await db
    .update(payment)
    .set({
      status: "completed",
      providerPaymentId: razorpayPaymentId,
      providerMetadata: mergedMeta,
      updatedAt: new Date(),
    })
    .where(eq(payment.id, paymentRow.id));

  await db.update(order).set({ status: "paid", updatedAt: new Date() }).where(eq(order.id, paymentRow.orderId));

  await notifyOrderConfirmation(paymentRow.orderId);

  return { ok: true, orderId: paymentRow.orderId };
}
