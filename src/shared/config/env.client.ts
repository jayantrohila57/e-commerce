export const clientEnv = {
  NODE_ENV: String(process.env.NODE_ENV),

  NEXT_PUBLIC_BASE_URL: String(process.env.NEXT_PUBLIC_BASE_URL),

  NEXT_PUBLIC_API_URL: String(process.env.NEXT_PUBLIC_API_URL),

  /** Razorpay Key ID (public). Used by checkout.js to open payment modal. */
  NEXT_PUBLIC_RAZORPAY_KEY_ID: String(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? ""),
};
