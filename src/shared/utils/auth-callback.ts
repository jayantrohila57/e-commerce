import type { Route } from "next";

/**
 * Returns a same-origin path safe to use after sign-in, or undefined if untrusted.
 * Rejects protocol-relative URLs, absolute URLs, and non-path values.
 */
export function safeAuthCallbackPath(raw: string | string[] | undefined | null): Route | undefined {
  if (raw == null) return undefined;
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (typeof value !== "string") return undefined;
  const decoded = decodeURIComponent(value.trim());
  if (!decoded.startsWith("/")) return undefined;
  if (decoded.startsWith("//")) return undefined;
  // Block scheme injection (e.g. "javascript:", "https:evil")
  if (/^[a-z][a-z0-9+.-]*:/i.test(decoded)) return undefined;
  return decoded as Route;
}

/** Build `/auth/sign-in` with optional validated return path (query `callbackUrl`). */
export function signInUrlWithCallback(callbackPath?: string | null): string {
  const safe = callbackPath ? safeAuthCallbackPath(callbackPath) : undefined;
  if (!safe) return "/auth/sign-in";
  return `/auth/sign-in?callbackUrl=${encodeURIComponent(safe)}`;
}
