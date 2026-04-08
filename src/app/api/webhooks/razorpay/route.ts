import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/core/db/db";
import { order, payment } from "@/core/db/db.schema";
import { verifyWebhookSignature } from "@/core/payment/razorpay.verify";
import { notifyOrderConfirmation } from "@/shared/components/mail/notification.service";
import { serverEnv } from "@/shared/config/env.server";
import { debugError, debugLog } from "@/shared/utils/lib/logger.utils";

export const dynamic = "force-dynamic";

type RazorpayWebhookPayload = {
  event: string;
  entity: string;
  payload?: {
    payment?: {
      entity?: {
        id?: string;
        order_id?: string;
        status?: string;
        amount?: number;
      };
    };
    order?: {
      entity?: {
        id?: string;
        status?: string;
      };
    };
  };
};

async function findPaymentByRazorpayOrderId(razorpayOrderId: string) {
  const rows = await db
    .select()
    .from(payment)
    .where(sql`${payment.providerMetadata}->>'razorpayOrderId' = ${razorpayOrderId}`)
    .limit(1);
  return rows[0] ?? null;
}

async function findPaymentByRazorpayPaymentId(razorpayPaymentId: string) {
  const rows = await db.select().from(payment).where(eq(payment.providerPaymentId, razorpayPaymentId)).limit(1);
  return rows[0] ?? null;
}

export async function POST(request: Request) {
  const signature = request.headers.get("x-razorpay-signature") ?? "";
  const webhookSecret = serverEnv.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    debugError("RAZORPAY_WEBHOOK", "RAZORPAY_WEBHOOK_SECRET not set");
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
    debugError("RAZORPAY_WEBHOOK", "Invalid signature");
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let body: RazorpayWebhookPayload;
  try {
    body = JSON.parse(rawBody) as RazorpayWebhookPayload;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const event = body.event;
  if (!event) {
    return NextResponse.json({ ok: true });
  }

  try {
    if (event === "payment.captured" && body.payload?.payment?.entity) {
      const entity = body.payload.payment.entity;
      const razorpayPaymentId = entity.id;
      const razorpayOrderId = entity.order_id;

      let paymentRow = razorpayPaymentId ? await findPaymentByRazorpayPaymentId(razorpayPaymentId) : null;
      if (!paymentRow && razorpayOrderId) {
        paymentRow = await findPaymentByRazorpayOrderId(razorpayOrderId);
      }

      const capturedAmount = entity.amount;
      if (
        paymentRow &&
        paymentRow.status !== "completed" &&
        typeof capturedAmount === "number" &&
        capturedAmount === paymentRow.amount
      ) {
        await db
          .update(payment)
          .set({
            status: "completed",
            providerPaymentId: razorpayPaymentId ?? paymentRow.providerPaymentId,
            updatedAt: new Date(),
          })
          .where(eq(payment.id, paymentRow.id));

        await db.update(order).set({ status: "paid", updatedAt: new Date() }).where(eq(order.id, paymentRow.orderId));

        debugLog("RAZORPAY_WEBHOOK", "payment.captured reconciled", {
          paymentId: paymentRow.id,
          orderId: paymentRow.orderId,
        });

        await notifyOrderConfirmation(paymentRow.orderId);
      } else if (paymentRow && paymentRow.status !== "completed") {
        debugError("RAZORPAY_WEBHOOK", "payment.captured skipped: amount mismatch or missing amount", {
          paymentId: paymentRow.id,
          orderId: paymentRow.orderId,
          expected: paymentRow.amount,
          captured: capturedAmount,
        });
      }
    } else if (event === "payment.failed" && body.payload?.payment?.entity) {
      const entity = body.payload.payment.entity;
      const razorpayOrderId = entity.order_id;
      const paymentRow = razorpayOrderId ? await findPaymentByRazorpayOrderId(razorpayOrderId) : null;

      if (paymentRow && paymentRow.status === "pending") {
        await db.update(payment).set({ status: "failed", updatedAt: new Date() }).where(eq(payment.id, paymentRow.id));
        debugLog("RAZORPAY_WEBHOOK", "payment.failed reconciled", {
          paymentId: paymentRow.id,
        });
      }
    }
  } catch (err) {
    debugError("RAZORPAY_WEBHOOK", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
