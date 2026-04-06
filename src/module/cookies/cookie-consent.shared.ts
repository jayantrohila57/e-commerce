import type { ConsentSource, CookieConsentPreferences, CookieConsentRecord } from "./cookie-consent.schema";
import {
  COOKIE_CONSENT_COOKIE_KEY,
  COOKIE_CONSENT_GIVEN_KEY,
  COOKIE_CONSENT_MONTHS,
  COOKIE_CONSENT_STORAGE_KEY,
  COOKIE_CONSENT_VERSION,
} from "./cookie-consent.schema";

export {
  COOKIE_CONSENT_COOKIE_KEY,
  COOKIE_CONSENT_GIVEN_KEY,
  COOKIE_CONSENT_MONTHS,
  COOKIE_CONSENT_STORAGE_KEY,
  COOKIE_CONSENT_VERSION,
};

export const defaultCookieConsentPreferences: CookieConsentPreferences = {
  essential: true,
  functional: false,
  analytics: false,
  marketing: false,
};

export function createCookieConsentRecord(
  preferences: Partial<CookieConsentPreferences>,
  options?: {
    region?: string | null;
    source?: ConsentSource;
    now?: Date;
  },
): CookieConsentRecord {
  const now = options?.now ?? new Date();
  const expiresAt = new Date(now);
  expiresAt.setMonth(expiresAt.getMonth() + COOKIE_CONSENT_MONTHS);

  return {
    ...defaultCookieConsentPreferences,
    ...preferences,
    essential: true,
    region: options?.region ?? null,
    consentVersion: COOKIE_CONSENT_VERSION,
    source: options?.source ?? "banner",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };
}

export function parseCookieConsentRecord(value: string | null | undefined): CookieConsentRecord | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as Partial<CookieConsentRecord>;
    if (typeof parsed !== "object" || parsed == null) return null;

    return {
      ...defaultCookieConsentPreferences,
      ...parsed,
      essential: true,
      region: parsed.region ?? null,
      consentVersion: parsed.consentVersion ?? COOKIE_CONSENT_VERSION,
      source: parsed.source ?? "banner",
      createdAt: parsed.createdAt ?? new Date().toISOString(),
      updatedAt: parsed.updatedAt ?? new Date().toISOString(),
      expiresAt: parsed.expiresAt ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function hasCookieConsentExpired(record: Pick<CookieConsentRecord, "expiresAt"> | null | undefined) {
  if (!record?.expiresAt) return true;
  return new Date(record.expiresAt).getTime() <= Date.now();
}

export function areCookiePreferencesEqual(
  left: Partial<CookieConsentPreferences> | null | undefined,
  right: Partial<CookieConsentPreferences> | null | undefined,
) {
  return (
    Boolean(left?.essential ?? true) === Boolean(right?.essential ?? true) &&
    Boolean(left?.functional) === Boolean(right?.functional) &&
    Boolean(left?.analytics) === Boolean(right?.analytics) &&
    Boolean(left?.marketing) === Boolean(right?.marketing)
  );
}

export function getRegionFromLocale(locale: string | undefined) {
  if (!locale) return null;
  const region = locale.split("-")[1];
  return region?.toUpperCase() ?? null;
}
