import "server-only";

/**
 * Centralized runtime configuration for server environment variables.
 * All environment variables must be defined in your deployment environment (.env, project settings, etc).
 * Provides type-coercion/defaults and helpful inline comments for quick reference.
 */
export const serverEnv = {
  // Node.js environment: 'development', 'production', etc.
  NODE_ENV: String(process.env.NODE_ENV),

  // Port to run the server on (optional, typically set by platform)
  PORT: Number(process.env.PORT),

  // Vercel-provided URL of deployment (for absolute URLs)
  VERCEL_URL: String(process.env.VERCEL_URL),

  // If true, disables environment variable validation checks
  SKIP_ENV_VALIDATION: Boolean(process.env.SKIP_ENV_VALIDATION),

  // Enable debug logs if true
  USE_DEBUG_LOGS: Boolean(process.env.USE_DEBUG_LOGS),

  // Better Auth configuration
  BETTER_AUTH_SECRET: String(process.env.BETTER_AUTH_SECRET),
  BETTER_AUTH_URL: String(process.env.BETTER_AUTH_URL),

  // GitHub OAuth credentials
  GITHUB_CLIENT_ID: String(process.env.GITHUB_CLIENT_ID),
  GITHUB_CLIENT_SECRET: String(process.env.GITHUB_CLIENT_SECRET),

  // Resend (email service) API credentials
  RESEND_API_KEY: String(process.env.RESEND_API_KEY),
  RESEND_FROM_EMAIL: String(process.env.RESEND_FROM_EMAIL),

  // Indicates Vercel environment (1 for true/production, 0 or undefined otherwise)
  VERCEL: Number(process.env.VERCEL),

  // Database connection string (required)
  DATABASE_URL: String(process.env.DATABASE_URL),

  // Arkjet API Key for integrations (optional/experimental)
  ARKJET_API_KEY: String(process.env.ARKJET_API_KEY),

  // Blob account token for read/write access (feature-specific)
  BLOB_READ_WRITE_TOKEN: String(process.env.BLOB_READ_WRITE_TOKEN),

  // Razorpay credentials (used for payment integration)
  RAZORPAY_API_KEY: String(process.env.RAZORPAY_API_KEY),
  RAZORPAY_API_SECRET: String(process.env.RAZORPAY_API_SECRET),

  /** Optional; only used for connected Razorpay accounts. When set, sent as X-Razorpay-Account header. */
  RAZORPAY_ACCOUNT_ID: process.env.RAZORPAY_ACCOUNT_ID?.trim() ?? "",

  /** Webhook secret from Dashboard (Settings → Webhooks). Required for webhook signature verification. */
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET?.trim() ?? "",
};
