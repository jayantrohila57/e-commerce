"use client";

import type { ConsentSource, CookieConsentPreferences, CookieConsentRecord } from "./cookie-consent.schema";
import {
  COOKIE_CONSENT_COOKIE_KEY,
  COOKIE_CONSENT_GIVEN_KEY,
  COOKIE_CONSENT_STORAGE_KEY,
  createCookieConsentRecord,
  getRegionFromLocale,
  parseCookieConsentRecord,
} from "./cookie-consent.shared";

const OPTIONAL_COOKIE_NAMES = [
  "analytics_enabled",
  "marketing_enabled",
  "functional_enabled",
  COOKIE_CONSENT_COOKIE_KEY,
];

export function getBrowserRegion() {
  if (typeof window === "undefined") return null;
  return getRegionFromLocale(window.navigator.language);
}

export function readCookieConsentFromStorage() {
  if (typeof window === "undefined") return null;

  const localValue = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
  const localRecord = parseCookieConsentRecord(localValue);
  if (localRecord) return localRecord;

  const cookies = document.cookie.split(";").map((entry) => entry.trim());
  const consentCookie = cookies.find((entry) => entry.startsWith(`${COOKIE_CONSENT_COOKIE_KEY}=`));
  if (!consentCookie) return null;

  const cookieValue = decodeURIComponent(consentCookie.split("=").slice(1).join("="));
  return parseCookieConsentRecord(cookieValue);
}

export function writeCookieConsentToStorage(
  preferences: Partial<CookieConsentPreferences>,
  options?: {
    region?: string | null;
    source?: ConsentSource;
  },
) {
  if (typeof window === "undefined") return null;

  const record = createCookieConsentRecord(preferences, {
    region: options?.region ?? getBrowserRegion(),
    source: options?.source,
  });

  window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(record));
  window.localStorage.setItem(COOKIE_CONSENT_GIVEN_KEY, "true");

  const maxAge = Math.max(0, Math.floor((new Date(record.expiresAt).getTime() - Date.now()) / 1000));
  document.cookie = `${COOKIE_CONSENT_COOKIE_KEY}=${encodeURIComponent(JSON.stringify(record))}; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `analytics_enabled=${record.analytics}; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `marketing_enabled=${record.marketing}; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `functional_enabled=${record.functional}; path=/; max-age=${maxAge}; SameSite=Lax`;

  return record;
}

export function overwriteCookieConsentRecord(record: CookieConsentRecord) {
  if (typeof window === "undefined") return null;

  window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(record));
  window.localStorage.setItem(COOKIE_CONSENT_GIVEN_KEY, "true");

  const maxAge = Math.max(0, Math.floor((new Date(record.expiresAt).getTime() - Date.now()) / 1000));
  document.cookie = `${COOKIE_CONSENT_COOKIE_KEY}=${encodeURIComponent(JSON.stringify(record))}; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `analytics_enabled=${record.analytics}; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `marketing_enabled=${record.marketing}; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `functional_enabled=${record.functional}; path=/; max-age=${maxAge}; SameSite=Lax`;

  return record;
}

export function clearOptionalConsentCookies() {
  if (typeof document === "undefined") return;
  for (const cookieName of OPTIONAL_COOKIE_NAMES) {
    document.cookie = `${cookieName}=; path=/; max-age=0`;
  }
}

export function clearCookieConsentStorage() {
  if (typeof window === "undefined") return;
  clearOptionalConsentCookies();
  window.localStorage.removeItem(COOKIE_CONSENT_STORAGE_KEY);
  window.localStorage.removeItem(COOKIE_CONSENT_GIVEN_KEY);
}
