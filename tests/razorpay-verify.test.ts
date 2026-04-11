import crypto from "node:crypto";
import { describe, expect, it } from "vitest";
import { verifyCheckoutSignature, verifyWebhookSignature } from "@/core/payment/razorpay.verify";

describe("razorpay.verify", () => {
  const secret = "test_webhook_secret_32_chars_min";

  it("accepts valid checkout signature", () => {
    const orderId = "order_123";
    const paymentId = "pay_456";
    const sig = crypto.createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
    expect(verifyCheckoutSignature(orderId, paymentId, sig, secret)).toBe(true);
  });

  it("rejects tampered checkout signature", () => {
    expect(verifyCheckoutSignature("order_1", "pay_1", "deadbeef", secret)).toBe(false);
  });

  it("accepts valid webhook signature (hex compare)", () => {
    const raw = '{"event":"payment.captured"}';
    const sig = crypto.createHmac("sha256", secret).update(raw).digest("hex");
    expect(verifyWebhookSignature(raw, sig, secret)).toBe(true);
  });

  it("rejects webhook signature length mismatch safely", () => {
    expect(verifyWebhookSignature("{}", "abc", secret)).toBe(false);
  });
});
