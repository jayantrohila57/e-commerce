import crypto from "node:crypto";

/**
 * Verify the signature returned by Razorpay Checkout on payment success.
 * Uses HMAC SHA256 with body = order_id|payment_id (Razorpay order id and payment id).
 */
export function verifyCheckoutSignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  signature: string,
  secret: string,
): boolean {
  if (!secret || !razorpayOrderId || !razorpayPaymentId || !signature) return false;
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  return expected === signature;
}

/**
 * Verify Razorpay webhook signature.
 * Body must be the raw request body (string or Buffer) as received, not parsed JSON.
 */
export function verifyWebhookSignature(rawBody: string | Buffer, signature: string, webhookSecret: string): boolean {
  if (!webhookSecret || !signature) return false;
  const expected = crypto.createHmac("sha256", webhookSecret).update(rawBody).digest("hex");
  return expected === signature;
}
