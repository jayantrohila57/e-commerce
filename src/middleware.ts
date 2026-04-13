import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const HEADER_INTENDED = "x-intended-path";

/**
 * Preserves the requested URL for auth redirects (account area, post-checkout views).
 * Downstream layouts read `x-intended-path` and pass it as `callbackUrl` to sign-in.
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const path = `${pathname}${search}`;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(HEADER_INTENDED, path);
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/account/:path*", "/store/order/:path*", "/store/checkout/confirmation", "/store/checkout/pay"],
};
