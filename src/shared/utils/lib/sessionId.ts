import { v4 as uuidv4 } from "uuid";

/** Cookie name shared by the browser and server for guest cart binding (must stay in sync). */
export const CART_SESSION_COOKIE_NAME = "cart_session_id";

/**
 * Parse guest cart session id from a raw `Cookie` header (tRPC / RSC request context).
 * Server trusts this value—not client-supplied JSON—for guest cart authorization.
 */
export function parseGuestCartSessionIdFromCookieHeader(cookieHeader: string | null | undefined): string | undefined {
  if (!cookieHeader) return undefined;
  const prefix = `${CART_SESSION_COOKIE_NAME}=`;
  for (const part of cookieHeader.split(";")) {
    const c = part.trim();
    if (c.startsWith(prefix)) {
      const value = decodeURIComponent(c.slice(prefix.length).trim());
      return value.length > 0 ? value : undefined;
    }
  }
  return undefined;
}

/**
 * Gets the current session ID from cookies or generates a new one.
 * Should be called in Client Components.
 */
export function getOrGenerateSessionId(): string {
  if (typeof window === "undefined") return "";

  const name = `${CART_SESSION_COOKIE_NAME}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }

  // Not found, generate new
  const sessionId = uuidv4();
  const d = new Date();
  d.setTime(d.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
  const expires = "expires=" + d.toUTCString();
  document.cookie = `${CART_SESSION_COOKIE_NAME}=${sessionId};${expires};path=/`;

  return sessionId;
}

/**
 * Gets the current session ID from cookies.
 * Can be used in Server Components/Actions.
 */
export function getSessionIdFromCookies(cookieStore: {
  get: (name: string) => { value: string } | undefined;
}): string | undefined {
  return cookieStore.get(CART_SESSION_COOKIE_NAME)?.value;
}
