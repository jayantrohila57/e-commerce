"use client";

import { Analytics } from "@vercel/analytics/next";
import { usePathname } from "next/navigation";
import { useCookieConsent } from "./use-cookie-consent";

export function ConsentAwareAnalytics() {
  const pathname = usePathname();
  const { canUseAnalytics, isLoaded } = useCookieConsent();

  const shouldAllowRoute = pathname == null || pathname.startsWith("/account") || !pathname.startsWith("/studio");

  if (!isLoaded || !canUseAnalytics || !shouldAllowRoute) {
    return null;
  }

  return <Analytics />;
}
