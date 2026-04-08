import "server-only";

import { z } from "zod/v3";

function truthyEnv(v: string | undefined): boolean {
  return v === "true" || v === "1";
}

const serverEnvSchema = z
  .object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().int().nonnegative().default(0),
    VERCEL_URL: z.string().default(""),
    SKIP_ENV_VALIDATION: z
      .string()
      .optional()
      .transform((v) => truthyEnv(v)),
    USE_DEBUG_LOGS: z
      .string()
      .optional()
      .transform((v) => truthyEnv(v)),

    BETTER_AUTH_SECRET: z.string().default(""),
    BETTER_AUTH_URL: z.string().default(""),

    GITHUB_CLIENT_ID: z.string().default(""),
    GITHUB_CLIENT_SECRET: z.string().default(""),

    RESEND_API_KEY: z.string().default(""),
    RESEND_FROM_EMAIL: z.string().default(""),

    VERCEL: z.coerce.number().default(0),

    DATABASE_URL: z.string().default(""),

    /** Arcjet key (ARKJET_API_KEY in code; ARCJET_API_KEY also accepted from .env.example). */
    ARKJET_API_KEY: z.string().default(""),

    BLOB_READ_WRITE_TOKEN: z.string().default(""),

    RAZORPAY_API_KEY: z.string().default(""),
    RAZORPAY_API_SECRET: z.string().default(""),
    RAZORPAY_ACCOUNT_ID: z.string().default(""),
    RAZORPAY_WEBHOOK_SECRET: z.string().default(""),
  })
  .superRefine((val, ctx) => {
    if (val.NODE_ENV !== "production" || val.SKIP_ENV_VALIDATION) return;

    const req = [
      ["DATABASE_URL", val.DATABASE_URL],
      ["BETTER_AUTH_SECRET", val.BETTER_AUTH_SECRET],
      ["BETTER_AUTH_URL", val.BETTER_AUTH_URL],
      ["RESEND_API_KEY", val.RESEND_API_KEY],
      ["RESEND_FROM_EMAIL", val.RESEND_FROM_EMAIL],
      ["RAZORPAY_API_KEY", val.RAZORPAY_API_KEY],
      ["RAZORPAY_API_SECRET", val.RAZORPAY_API_SECRET],
      ["RAZORPAY_WEBHOOK_SECRET", val.RAZORPAY_WEBHOOK_SECRET],
    ] as const;

    for (const [key, v] of req) {
      if (!v || v === "undefined") {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Missing required env: ${key}`, path: [key] });
      }
    }

    if (val.BETTER_AUTH_SECRET.length < 16) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "BETTER_AUTH_SECRET must be at least 16 characters in production",
        path: ["BETTER_AUTH_SECRET"],
      });
    }
  });

function readRawFromProcess() {
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    VERCEL_URL: process.env.VERCEL_URL,
    SKIP_ENV_VALIDATION: process.env.SKIP_ENV_VALIDATION,
    USE_DEBUG_LOGS: process.env.USE_DEBUG_LOGS,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
    VERCEL: process.env.VERCEL,
    DATABASE_URL: process.env.DATABASE_URL,
    ARKJET_API_KEY: process.env.ARKJET_API_KEY?.trim() || process.env.ARCJET_API_KEY?.trim() || "",
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
    RAZORPAY_API_KEY: process.env.RAZORPAY_API_KEY,
    RAZORPAY_API_SECRET: process.env.RAZORPAY_API_SECRET,
    RAZORPAY_ACCOUNT_ID: process.env.RAZORPAY_ACCOUNT_ID?.trim(),
    RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET?.trim(),
  };
}

/**
 * Validated server environment. In production (unless SKIP_ENV_VALIDATION), missing payment/auth/db vars throw at boot.
 */
export const serverEnv = serverEnvSchema.parse(readRawFromProcess());
