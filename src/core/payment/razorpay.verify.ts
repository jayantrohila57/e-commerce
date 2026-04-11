import crypto from "node:crypto";

/**
 * Compare two hex-encoded HMAC digests in constant time to reduce timing side channels.
 */
function timingSafeEqualHex(a: string, b: string): boolean {
  const normA = a.trim().toLowerCase();
  const normB = b.trim().toLowerCase();
  if (!/^[0-9a-f]+$/i.test(normA) || !/^[0-9a-f]+$/i.test(normB)) {
    return false;
  }
  try {
    const bufA = Buffer.from(normA, "hex");
    const bufB = Buffer.from(normB, "hex");
    if (bufA.length !== bufB.length) {
      return false;
    }
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

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
  return timingSafeEqualHex(expected, signature);
}

/**
 * Verify Razorpay webhook signature.
 * Body must be the raw request body (string or Buffer) as received, not parsed JSON.
 */
export function verifyWebhookSignature(rawBody: string | Buffer, signature: string, webhookSecret: string): boolean {
  if (!webhookSecret || !signature) return false;
  const expected = crypto.createHmac("sha256", webhookSecret).update(rawBody).digest("hex");
  return timingSafeEqualHex(expected, signature);
}
