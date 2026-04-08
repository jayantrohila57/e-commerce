import { z } from "zod/v3";

const clientEnvSchema = z
  .object({
    NODE_ENV: z.string().default("development"),
    NEXT_PUBLIC_BASE_URL: z.string().default(""),
    NEXT_PUBLIC_API_URL: z.string().default(""),
    NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().default(""),
    /** Set explicitly in production; no hardcoded default analytics ID. */
    NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID: z.string().default(""),
  })
  .superRefine((val, ctx) => {
    if (val.NODE_ENV === "production" && !val.NEXT_PUBLIC_BASE_URL?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "NEXT_PUBLIC_BASE_URL is required in production for canonical URLs and SEO",
        path: ["NEXT_PUBLIC_BASE_URL"],
      });
    }
  });

export const clientEnv = clientEnvSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID,
});
