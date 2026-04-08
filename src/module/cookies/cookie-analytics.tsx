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

  const gaId = clientEnv.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  const gtmId = clientEnv.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID?.trim();
  const hasGaOrGtm = Boolean(gaId) || Boolean(gtmId);

  return (
    <>
      <Analytics />
      {hasGaOrGtm ? (
        <>
          {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
          {gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
        </>
      ) : null}
    </>
  );
}
