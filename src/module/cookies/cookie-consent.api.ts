import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/core/api/api.methods";
import { db } from "@/core/db/db";
import { cookieConsentAuditLog, userCookieConsent } from "@/core/db/db.schema";
import { STATUS } from "@/shared/config/api.config";
import { API_RESPONSE } from "@/shared/config/api.utils";
import { debugError } from "@/shared/utils/lib/logger.utils";
import type { CookieConsentRecord } from "./cookie-consent.schema";
import { cookieConsentContract } from "./cookie-consent.schema";
import { createCookieConsentRecord, hasCookieConsentExpired } from "./cookie-consent.shared";

type CookieConsentCurrentResponse = typeof cookieConsentContract.getCurrent.output._type;
type CookieConsentSaveResponse = typeof cookieConsentContract.save.output._type;
type CookieConsentSyncResponse = typeof cookieConsentContract.syncAfterLogin.output._type;
type CookieConsentExpireResponse = typeof cookieConsentContract.expire.output._type;

function resolveRegion(headers: Headers) {
  return (
    headers.get("x-vercel-ip-country") ??
    headers.get("cf-ipcountry") ??
    headers.get("x-country-code") ??
    headers.get("x-region") ??
    null
  );
}

function resolveIpAddress(headers: Headers) {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? headers.get("x-real-ip") ?? null;
}

function toConsentRecord(row: typeof userCookieConsent.$inferSelect): CookieConsentRecord {
  return {
    essential: true,
    functional: row.functional,
    analytics: row.analytics,
    marketing: row.marketing,
    region: row.region,
    consentVersion: row.consentVersion,
    source: row.source,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    expiresAt: row.expiresAt.toISOString(),
  };
}

async function persistConsent(params: {
  userId: string;
  headers: Headers;
  preferences: {
    essential: true;
    functional: boolean;
    analytics: boolean;
    marketing: boolean;
    region: string | null;
    source: "banner" | "account" | "sync" | "server";
  };
}) {
  const record = createCookieConsentRecord(params.preferences, {
    region: params.preferences.region ?? resolveRegion(params.headers),
    source: params.preferences.source,
  });
  const ipAddress = resolveIpAddress(params.headers);
  const userAgent = params.headers.get("user-agent");

  const existing = await db.query.userCookieConsent.findFirst({
    where: eq(userCookieConsent.userId, params.userId),
  });

  const rowValues = {
    essential: record.essential,
    functional: record.functional,
    analytics: record.analytics,
    marketing: record.marketing,
    region: record.region,
    consentVersion: record.consentVersion,
    source: record.source,
    expiresAt: new Date(record.expiresAt),
    ipAddress,
    userAgent,
    updatedAt: new Date(record.updatedAt),
  };

  const saved =
    existing == null
      ? (
          await db
            .insert(userCookieConsent)
            .values({
              id: uuidv4(),
              userId: params.userId,
              ...rowValues,
              createdAt: new Date(record.createdAt),
            })
            .returning()
        )[0]
      : (
          await db
            .update(userCookieConsent)
            .set(rowValues)
            .where(eq(userCookieConsent.userId, params.userId))
            .returning()
        )[0];

  await db.insert(cookieConsentAuditLog).values({
    id: uuidv4(),
    userId: params.userId,
    essential: record.essential,
    functional: record.functional,
    analytics: record.analytics,
    marketing: record.marketing,
    region: record.region,
    consentVersion: record.consentVersion,
    source: record.source,
    expiresAt: new Date(record.expiresAt),
    ipAddress,
    userAgent,
    createdAt: new Date(record.updatedAt),
  });

  // Future-ready extension point:
  // If anonymous consent audit logging becomes required later, add a parallel write here
  // when params.userId is absent and store an anonymous/session identifier instead.

  return toConsentRecord(saved);
}

export const cookieConsentRouter = createTRPCRouter({
  getCurrent: publicProcedure
    .input(cookieConsentContract.getCurrent.input)
    .output(cookieConsentContract.getCurrent.output)
    .query(async ({ ctx }): Promise<CookieConsentCurrentResponse> => {
      try {
        if (!ctx.user?.id) {
          return API_RESPONSE(STATUS.SUCCESS, "Consent retrieved", {
            consent: null,
            region: resolveRegion(ctx.headers),
          });
        }

        const current = await db.query.userCookieConsent.findFirst({
          where: eq(userCookieConsent.userId, ctx.user.id),
        });

        return API_RESPONSE(STATUS.SUCCESS, "Consent retrieved", {
          consent: current ? toConsentRecord(current) : null,
          region: resolveRegion(ctx.headers),
        });
      } catch (err) {
        debugError("COOKIE_CONSENT:GET_CURRENT:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error retrieving cookie consent", {
          consent: null,
          region: null,
        });
      }
    }),

  save: protectedProcedure
    .input(cookieConsentContract.save.input)
    .output(cookieConsentContract.save.output)
    .mutation(async ({ input, ctx }): Promise<CookieConsentSaveResponse> => {
      try {
        const saved = await persistConsent({
          userId: ctx.user.id,
          headers: ctx.headers,
          preferences: {
            ...input.body,
            essential: true,
            region: input.body.region ?? resolveRegion(ctx.headers),
          },
        });

        return API_RESPONSE(STATUS.SUCCESS, "Cookie consent saved", saved);
      } catch (err) {
        debugError("COOKIE_CONSENT:SAVE:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error saving cookie consent", null, err as Error);
      }
    }),

  syncAfterLogin: protectedProcedure
    .input(cookieConsentContract.syncAfterLogin.input)
    .output(cookieConsentContract.syncAfterLogin.output)
    .mutation(async ({ input, ctx }): Promise<CookieConsentSyncResponse> => {
      try {
        const current = await db.query.userCookieConsent.findFirst({
          where: eq(userCookieConsent.userId, ctx.user.id),
        });
        const browserConsent = input.body.browserConsent;

        if (!current && browserConsent) {
          const saved = await persistConsent({
            userId: ctx.user.id,
            headers: ctx.headers,
            preferences: {
              essential: true,
              functional: browserConsent.functional,
              analytics: browserConsent.analytics,
              marketing: browserConsent.marketing,
              region: browserConsent.region,
              source: "sync",
            },
          });

          return API_RESPONSE(STATUS.SUCCESS, "Browser consent synced", {
            mode: "db-saved",
            consent: saved,
          });
        }

        if (!current) {
          return API_RESPONSE(STATUS.SUCCESS, "No consent to sync", {
            mode: "noop",
            consent: null,
          });
        }

        const currentRecord = toConsentRecord(current);
        if (
          browserConsent &&
          (browserConsent.functional !== currentRecord.functional ||
            browserConsent.analytics !== currentRecord.analytics ||
            browserConsent.marketing !== currentRecord.marketing)
        ) {
          return API_RESPONSE(STATUS.SUCCESS, "Saved privacy preferences available", {
            mode: "db-overrides",
            consent: currentRecord,
          });
        }

        return API_RESPONSE(STATUS.SUCCESS, "Consent already in sync", {
          mode: "noop",
          consent: currentRecord,
        });
      } catch (err) {
        debugError("COOKIE_CONSENT:SYNC:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error syncing cookie consent", {
          mode: "noop",
          consent: null,
        });
      }
    }),

  expire: protectedProcedure
    .input(cookieConsentContract.expire.input)
    .output(cookieConsentContract.expire.output)
    .mutation(async ({ ctx }): Promise<CookieConsentExpireResponse> => {
      try {
        const existing = await db.query.userCookieConsent.findFirst({
          where: eq(userCookieConsent.userId, ctx.user.id),
        });

        if (!existing) {
          return API_RESPONSE(STATUS.SUCCESS, "Consent already expired", null);
        }

        const [expired] = await db
          .update(userCookieConsent)
          .set({
            expiresAt: new Date(Date.now() - 1000),
            updatedAt: new Date(),
          })
          .where(eq(userCookieConsent.userId, ctx.user.id))
          .returning();

        const expiredRecord = expired ? toConsentRecord(expired) : null;
        if (expiredRecord && hasCookieConsentExpired(expiredRecord)) {
          await db.insert(cookieConsentAuditLog).values({
            id: uuidv4(),
            userId: ctx.user.id,
            essential: expiredRecord.essential,
            functional: expiredRecord.functional,
            analytics: expiredRecord.analytics,
            marketing: expiredRecord.marketing,
            region: expiredRecord.region,
            consentVersion: expiredRecord.consentVersion,
            source: "server",
            expiresAt: new Date(expiredRecord.expiresAt),
            ipAddress: resolveIpAddress(ctx.headers),
            userAgent: ctx.headers.get("user-agent"),
            createdAt: new Date(),
          });
        }

        return API_RESPONSE(STATUS.SUCCESS, "Consent expired", expiredRecord);
      } catch (err) {
        debugError("COOKIE_CONSENT:EXPIRE:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error expiring cookie consent", null);
      }
    }),
});
