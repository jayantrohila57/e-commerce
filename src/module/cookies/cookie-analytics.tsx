"use client";

import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";

import { Analytics } from "@vercel/analytics/next";
import { usePathname } from "next/navigation";
import { clientEnv } from "@/shared/config/env.client";
import { useCookieConsent } from "./use-cookie-consent";

export function ConsentAwareAnalytics() {
  const pathname = usePathname();
  const { canUseAnalytics, isLoaded } = useCookieConsent();

  const shouldAllowRoute = pathname == null || pathname.startsWith("/account") || !pathname.startsWith("/studio");

  if (!isLoaded || !canUseAnalytics || !shouldAllowRoute) {
    return null;
  }

  return (
    <>
      <Analytics />
      <GoogleAnalytics gaId={clientEnv.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID} />
      <GoogleTagManager gtmId={clientEnv.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID} />
    </>
  );
}
