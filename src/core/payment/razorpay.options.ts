/**
 * Build Razorpay order options from app order context.
 * Amount must be in smallest currency unit (paise for INR).
 * Receipt is used for idempotency and linking to our order.
 */
export function buildRazorpayOrderOptions(params: {
  amount: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}) {
  const { amount, currency, receipt, notes } = params;
  return {
    amount,
    currency: currency || "INR",
    receipt: receipt.slice(0, 40),
    ...(notes && Object.keys(notes).length > 0 ? { notes } : {}),
  };
}
