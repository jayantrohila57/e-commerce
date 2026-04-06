"use client";

import { useEffect, useState } from "react";
import {
  clearCookieConsentStorage,
  clearOptionalConsentCookies,
  overwriteCookieConsentRecord,
  readCookieConsentFromStorage,
  writeCookieConsentToStorage,
} from "./cookie-consent.browser";
import type { ConsentSource, CookieConsentPreferences, CookieConsentRecord } from "./cookie-consent.schema";
import {
  areCookiePreferencesEqual,
  defaultCookieConsentPreferences,
  hasCookieConsentExpired,
} from "./cookie-consent.shared";

export function useCookieConsent() {
  const [record, setRecord] = useState<CookieConsentRecord | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const current = readCookieConsentFromStorage();
    if (current && hasCookieConsentExpired(current)) {
      clearCookieConsentStorage();
      setRecord(null);
    } else {
      setRecord(current);
    }
    setIsLoaded(true);
  }, []);

  const updatePreferences = (
    preferences: Partial<CookieConsentPreferences>,
    options?: {
      region?: string | null;
      source?: ConsentSource;
    },
  ) => {
    const next = writeCookieConsentToStorage(
      {
        ...defaultCookieConsentPreferences,
        ...preferences,
        essential: true,
      },
      options,
    );
    if (next) setRecord(next);
    return next;
  };

  const overwriteFromServer = (next: CookieConsentRecord) => {
    const saved = overwriteCookieConsentRecord(next);
    if (saved) setRecord(saved);
    return saved;
  };

  const resetConsent = () => {
    clearCookieConsentStorage();
    setRecord(null);
  };

  return {
    record,
    isLoaded,
    hasConsent: Boolean(record),
    isExpired: hasCookieConsentExpired(record),
    preferences: record ?? null,
    updatePreferences,
    overwriteFromServer,
    resetConsent,
    canUseAnalytics: Boolean(record?.analytics) && !hasCookieConsentExpired(record),
    canUseMarketing: Boolean(record?.marketing) && !hasCookieConsentExpired(record),
    canUseFunctional: Boolean(record?.functional) && !hasCookieConsentExpired(record),
    hasSamePreferences: (other: Partial<CookieConsentPreferences> | null | undefined) =>
      areCookiePreferencesEqual(record, other),
  };
}
