import { describe, expect, it } from "vitest";
import { CART_SESSION_COOKIE_NAME, parseGuestCartSessionIdFromCookieHeader } from "@/shared/utils/lib/sessionId";

describe("guest cart session cookie", () => {
  it("parses cart_session_id from Cookie header", () => {
    const id = "550e8400-e29b-41d4-a716-446655440000";
    expect(parseGuestCartSessionIdFromCookieHeader(`${CART_SESSION_COOKIE_NAME}=${id}`)).toBe(id);
  });

  it("parses among multiple cookies", () => {
    const id = "abc";
    const header = `foo=1; ${CART_SESSION_COOKIE_NAME}=${id}; bar=2`;
    expect(parseGuestCartSessionIdFromCookieHeader(header)).toBe(id);
  });

  it("returns undefined when missing", () => {
    expect(parseGuestCartSessionIdFromCookieHeader(undefined)).toBeUndefined();
    expect(parseGuestCartSessionIdFromCookieHeader("other=value")).toBeUndefined();
  });
});
