import "server-only";

import { serverEnv } from "@/shared/config/env.server";

/** Absolute origin for server-side redirects (Razorpay callback, emails, etc.). */
export function getPublicBaseUrl(): string {
  const fromPublic = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (fromPublic) return fromPublic.replace(/\/$/, "");

  const vercel = serverEnv.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;

  const authUrl = serverEnv.BETTER_AUTH_URL?.trim();
  if (authUrl) {
    try {
      return new URL(authUrl).origin;
    } catch {
      /* ignore */
    }
  }

  return "http://localhost:3000";
}
