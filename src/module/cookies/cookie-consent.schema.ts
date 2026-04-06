import { z } from "zod/v3";
import { detailedResponse } from "@/shared/schema";

export const COOKIE_CONSENT_VERSION = 1;
export const COOKIE_CONSENT_MONTHS = 6;
export const COOKIE_CONSENT_STORAGE_KEY = "cookie-consent-record";
export const COOKIE_CONSENT_GIVEN_KEY = "cookie-consent-given";
export const COOKIE_CONSENT_COOKIE_KEY = "cookie_consent";

export const consentSourceSchema = z.enum(["banner", "account", "sync", "server"]);

export const cookieConsentPreferencesSchema = z.object({
  essential: z.literal(true).default(true),
  functional: z.boolean().default(false),
  analytics: z.boolean().default(false),
  marketing: z.boolean().default(false),
});

export const cookieConsentRecordSchema = cookieConsentPreferencesSchema.extend({
  region: z.string().nullable().default(null),
  consentVersion: z.number().int().default(COOKIE_CONSENT_VERSION),
  source: consentSourceSchema.default("banner"),
  createdAt: z.string(),
  updatedAt: z.string(),
  expiresAt: z.string(),
});

export const cookieConsentAuditRecordSchema = cookieConsentRecordSchema.extend({
  userId: z.string().nullable().default(null),
});

export const cookieConsentContract = {
  getCurrent: {
    input: z.void(),
    output: detailedResponse(
      z.object({
        consent: cookieConsentRecordSchema.nullable(),
        region: z.string().nullable(),
      }),
    ),
  },
  save: {
    input: z.object({
      body: cookieConsentRecordSchema.pick({
        essential: true,
        functional: true,
        analytics: true,
        marketing: true,
        region: true,
        source: true,
      }),
    }),
    output: detailedResponse(cookieConsentRecordSchema),
  },
  syncAfterLogin: {
    input: z.object({
      body: z.object({
        browserConsent: cookieConsentRecordSchema.nullable(),
      }),
    }),
    output: detailedResponse(
      z.object({
        mode: z.enum(["noop", "db-saved", "db-overrides"]),
        consent: cookieConsentRecordSchema.nullable(),
      }),
    ),
  },
  expire: {
    input: z.void(),
    output: detailedResponse(cookieConsentRecordSchema.nullable()),
  },
};

export type CookieConsentPreferences = z.infer<typeof cookieConsentPreferencesSchema>;
export type CookieConsentRecord = z.infer<typeof cookieConsentRecordSchema>;
export type CookieConsentAuditRecord = z.infer<typeof cookieConsentAuditRecordSchema>;
export type ConsentCategory = keyof CookieConsentPreferences;
export type ConsentSource = z.infer<typeof consentSourceSchema>;
