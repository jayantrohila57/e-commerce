import { and, eq, ilike, isNull, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { createTRPCRouter, publicProcedure, staffProcedure } from "@/core/api/api.methods";
import { db } from "@/core/db/db";
import { marketingContent } from "@/core/db/db.schema";
import { MESSAGE, STATUS } from "@/shared/config/api.config";
import { API_RESPONSE } from "@/shared/config/api.utils";
import { detailedResponse } from "@/shared/schema/api.schema";
import { calculateOffset, paginationMetaSchema } from "@/shared/schema/pagination.schema";
import { debugError } from "@/shared/utils/lib/logger.utils";
import { marketingContentContract } from "./marketing-content.schema";

export const marketingContentRouter = createTRPCRouter({
  get: staffProcedure
    .input(marketingContentContract.get.input)
    .output(marketingContentContract.get.output)
    .query(async ({ input }) => {
      try {
        const row = await db.query.marketingContent.findFirst({
          where: (mc, { eq }) => eq(mc.id, input.params.id),
        });

        return API_RESPONSE(
          row ? STATUS.SUCCESS : STATUS.FAILED,
          row ? MESSAGE.MARKETING_CONTENT.GET.SUCCESS : MESSAGE.MARKETING_CONTENT.GET.FAILED,
          row ?? null,
        );
      } catch (err) {
        debugError("MARKETING_CONTENT:GET:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, MESSAGE.MARKETING_CONTENT.GET.ERROR, null, err as Error);
      }
    }),

  getMany: staffProcedure
    .input(marketingContentContract.getMany.input)
    .output(marketingContentContract.getMany.output)
    .query(async ({ input }) => {
      try {
        const query = input.query;

        const conditions = [];
        if (query?.page) conditions.push(eq(marketingContent.page, query.page));
        if (query?.section) conditions.push(eq(marketingContent.section, query.section));
        if (query?.isActive !== undefined) conditions.push(eq(marketingContent.isActive, query.isActive));

        const where = conditions.length ? and(...conditions) : undefined;

        const page = query?.offset !== undefined && query?.limit !== undefined ? undefined : 1;
        const limit = query?.limit ?? 20;
        const offset = query?.offset ?? calculateOffset(page ?? 1, limit);

        const [{ count: totalRaw = 0 } = { count: 0 }] = await db
          .select({ count: sql<number>`count(*)` })
          .from(marketingContent)
          .where(where);

        const total = Number(totalRaw ?? 0);
        const totalPages = Math.max(1, Math.ceil(total / limit));

        const rows = await db.query.marketingContent.findMany({
          where,
          limit,
          offset,
          orderBy: (mc, { asc }) => [asc(mc.displayOrder), asc(mc.createdAt)],
        });

        return {
          status: rows.length ? STATUS.SUCCESS : STATUS.FAILED,
          message: rows.length ? MESSAGE.MARKETING_CONTENT.GET_MANY.SUCCESS : MESSAGE.MARKETING_CONTENT.GET_MANY.FAILED,
          data: rows,
          meta: {
            pagination: {
              page: page ?? 1,
              limit,
              total,
              totalPages,
              hasNext: offset + limit < total,
              hasPrev: offset > 0,
            },
            filters: {
              page: query?.page,
              section: query?.section,
              isActive: query?.isActive,
            },
          },
        };
      } catch (err) {
        debugError("MARKETING_CONTENT:GET_MANY:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, MESSAGE.MARKETING_CONTENT.GET_MANY.ERROR, null, err as Error);
      }
    }),

  getManyPublic: publicProcedure
    .input(marketingContentContract.getMany.input)
    .output(marketingContentContract.getMany.output)
    .query(async ({ input }) => {
      try {
        const query = input.query;
        const conditions = [];
        if (query?.page) conditions.push(eq(marketingContent.page, query.page));
        if (query?.section) conditions.push(eq(marketingContent.section, query.section));
        conditions.push(eq(marketingContent.isActive, query?.isActive ?? true));

        const where = conditions.length ? and(...conditions) : undefined;

        const limit = query?.limit ?? 20;
        const offset = query?.offset ?? 0;

        const rows = await db.query.marketingContent.findMany({
          where,
          limit,
          offset,
          orderBy: (mc, { asc }) => [asc(mc.displayOrder), asc(mc.createdAt)],
        });

        return {
          status: rows.length ? STATUS.SUCCESS : STATUS.FAILED,
          message: rows.length ? MESSAGE.MARKETING_CONTENT.GET_MANY.SUCCESS : MESSAGE.MARKETING_CONTENT.GET_MANY.FAILED,
          data: rows,
        };
      } catch (err) {
        debugError("MARKETING_CONTENT:GET_MANY_PUBLIC:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, MESSAGE.MARKETING_CONTENT.GET_MANY.ERROR, null, err as Error);
      }
    }),

  create: staffProcedure
    .input(marketingContentContract.create.input)
    .output(marketingContentContract.create.output)
    .mutation(async ({ input }) => {
      try {
        const id = uuidv4();
        const now = new Date();

        const [row] = await db
          .insert(marketingContent)
          .values({
            id,
            page: input.body.page,
            section: input.body.section,
            title: input.body.title ?? null,
            bodyText: input.body.bodyText ?? null,
            image: input.body.image ?? null,
            ctaLabel: input.body.ctaLabel ?? null,
            ctaLink: input.body.ctaLink ?? null,
            productLink: input.body.productLink ?? null,
            items: input.body.items ?? null,
            displayOrder: input.body.displayOrder ?? 0,
            isActive: input.body.isActive ?? true,
            startsAt: input.body.startsAt ?? null,
            endsAt: input.body.endsAt ?? null,
            createdAt: now,
            updatedAt: now,
          })
          .returning();

        return API_RESPONSE(STATUS.SUCCESS, MESSAGE.MARKETING_CONTENT.CREATE.SUCCESS, row);
      } catch (err) {
        debugError("MARKETING_CONTENT:CREATE:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, MESSAGE.MARKETING_CONTENT.CREATE.ERROR, null, err as Error);
      }
    }),

  update: staffProcedure
    .input(marketingContentContract.update.input)
    .output(marketingContentContract.update.output)
    .mutation(async ({ input }) => {
      try {
        const [row] = await db
          .update(marketingContent)
          .set({
            page: input.body.page,
            section: input.body.section,
            title: input.body.title ?? null,
            bodyText: input.body.bodyText ?? null,
            image: input.body.image ?? null,
            ctaLabel: input.body.ctaLabel ?? null,
            ctaLink: input.body.ctaLink ?? null,
            productLink: input.body.productLink ?? null,
            items: input.body.items ?? null,
            displayOrder: input.body.displayOrder,
            isActive: input.body.isActive,
            startsAt: input.body.startsAt ?? null,
            endsAt: input.body.endsAt ?? null,
            updatedAt: new Date(),
          })
          .where(eq(marketingContent.id, input.params.id))
          .returning();

        return API_RESPONSE(
          row ? STATUS.SUCCESS : STATUS.FAILED,
          row ? MESSAGE.MARKETING_CONTENT.UPDATE.SUCCESS : MESSAGE.MARKETING_CONTENT.UPDATE.FAILED,
          row ?? null,
        );
      } catch (err) {
        debugError("MARKETING_CONTENT:UPDATE:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, MESSAGE.MARKETING_CONTENT.UPDATE.ERROR, null, err as Error);
      }
    }),

  delete: staffProcedure
    .input(marketingContentContract.delete.input)
    .output(marketingContentContract.delete.output)
    .mutation(async ({ input }) => {
      try {
        const [row] = await db
          .delete(marketingContent)
          .where(eq(marketingContent.id, input.params.id))
          .returning({ id: marketingContent.id });

        return API_RESPONSE(
          row ? STATUS.SUCCESS : STATUS.FAILED,
          row ? MESSAGE.MARKETING_CONTENT.DELETE.SUCCESS : MESSAGE.MARKETING_CONTENT.DELETE.FAILED,
          row ?? null,
        );
      } catch (err) {
        debugError("MARKETING_CONTENT:DELETE:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, MESSAGE.MARKETING_CONTENT.DELETE.ERROR, null, err as Error);
      }
    }),
});
