import { and, eq, ilike, isNull, or, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { createTRPCRouter, publicProcedure, staffProcedure } from "@/core/api/api.methods";
import { db } from "@/core/db/db";
import { attribute } from "@/core/db/db.schema";
import { STATUS } from "@/shared/config/api.config";
import { API_RESPONSE } from "@/shared/config/api.utils";
import { buildPagination, buildPaginationMeta } from "@/shared/schema";
import { debugError } from "@/shared/utils/lib/logger.utils";
import { attributeContract } from "./attribute.schema";

export const attributeRouter = createTRPCRouter({
  /**
   * Get attribute by id
   */
  get: publicProcedure
    .input(attributeContract.get.input)
    .output(attributeContract.get.output)
    .query(async ({ input }) => {
      try {
        const data = await db.query.attribute.findFirst({
          where: (a, { and, eq, isNull }) => and(eq(a.id, input.params.id), isNull(a.deletedAt)),
        });

        return API_RESPONSE(STATUS.SUCCESS, "Attribute retrieved", data ?? null);
      } catch (err) {
        debugError("ATTRIBUTE:GET:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error retrieving attribute", null, err as Error);
      }
    }),

  /**
   * Get attribute by slug
   */
  getBySlug: publicProcedure
    .input(attributeContract.getBySlug.input)
    .output(attributeContract.getBySlug.output)
    .query(async ({ input }) => {
      try {
        const data = await db.query.attribute.findFirst({
          where: (a, { and, eq, isNull }) => and(eq(a.slug, input.params.slug), isNull(a.deletedAt)),
        });

        return API_RESPONSE(STATUS.SUCCESS, "Attribute retrieved", data ?? null);
      } catch (err) {
        debugError("ATTRIBUTE:GET_BY_SLUG:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error retrieving attribute", null, err as Error);
      }
    }),

  /**
   * Get all attributes, optionally filtered by series
   */
  getMany: publicProcedure
    .input(attributeContract.getMany.input)
    .output(attributeContract.getMany.output)
    .query(async ({ input }) => {
      try {
        const { seriesSlug, search, limit = 20, offset = 0 } = input.query || {};
        const q = search?.trim();

        const pageInput = {
          page: Math.floor(offset / limit) + 1,
          limit,
          sortBy: undefined as string | undefined,
          sortOrder: "asc" as const,
        };

        const paging = buildPagination(pageInput);
        const effectiveOffset = paging.offset;
        const effectiveLimit = paging.limit;

        const baseConditions = [
          isNull(attribute.deletedAt),
          seriesSlug ? eq(attribute.seriesSlug, seriesSlug) : undefined,
          q
            ? or(ilike(attribute.title, `%${q}%`), ilike(attribute.slug, `%${q}%`), ilike(attribute.value, `%${q}%`))
            : undefined,
        ].filter((condition): condition is NonNullable<typeof condition> => Boolean(condition));

        const [{ count: totalRaw = 0 } = { count: 0 }] = await db
          .select({ count: sql<number>`count(*)` })
          .from(attribute)
          .where(baseConditions.length ? and(...baseConditions) : undefined);
        const total = Number(totalRaw ?? 0);

        const data = await db.query.attribute.findMany({
          where: (a, helpers) => {
            const { and, eq, isNull, or } = helpers;
            const conditions = [isNull(a.deletedAt)];
            if (seriesSlug) conditions.push(eq(a.seriesSlug, seriesSlug));
            if (q) {
              conditions.push(or(ilike(a.title, `%${q}%`), ilike(a.slug, `%${q}%`), ilike(a.value, `%${q}%`))!);
            }
            return and(...conditions);
          },
          orderBy: (attr, { asc }) => [asc(attr.displayOrder)],
          limit: effectiveLimit,
          offset: effectiveOffset,
        });

        const metaPagination = buildPaginationMeta(total, pageInput);

        return {
          status: STATUS.SUCCESS,
          message: "Attributes retrieved",
          data,
          meta: {
            count: total,
            pagination: metaPagination,
          },
        };
      } catch (err) {
        debugError("ATTRIBUTE:GET_MANY:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error retrieving attributes", [], err as Error);
      }
    }),

  /**
   * Get attributes by series (param-based)
   */
  getBySeries: publicProcedure
    .input(attributeContract.getBySeries.input)
    .output(attributeContract.getBySeries.output)
    .query(async ({ input }) => {
      try {
        const { limit = 20, offset = 0 } = input.query || {};
        const { seriesSlug } = input.params;

        const data = await db.query.attribute.findMany({
          where: (a, { and, eq, isNull }) => and(eq(a.seriesSlug, seriesSlug), isNull(a.deletedAt)),
          orderBy: (a, { asc }) => [asc(a.displayOrder)],
          limit,
          offset,
        });

        return API_RESPONSE(STATUS.SUCCESS, "Attributes retrieved", data);
      } catch (err) {
        debugError("ATTRIBUTE:GET_BY_SERIES:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error retrieving attributes", [], err as Error);
      }
    }),

  /**
   * Search attributes
   */
  search: publicProcedure
    .input(attributeContract.search.input)
    .output(attributeContract.search.output)
    .query(async ({ input }) => {
      try {
        const { limit = 20, offset = 0, seriesSlug, search } = input.query;
        const q = search?.trim();

        const data = await db.query.attribute.findMany({
          where: (a, { and, eq, isNull }) => {
            const conditions = [isNull(a.deletedAt)];
            if (seriesSlug) conditions.push(eq(a.seriesSlug, seriesSlug));
            if (q) {
              conditions.push(or(ilike(a.title, `%${q}%`), ilike(a.slug, `%${q}%`), ilike(a.value, `%${q}%`))!);
            }
            return and(...conditions);
          },
          orderBy: (a, { asc }) => [asc(a.displayOrder)],
          limit,
          offset,
        });

        return API_RESPONSE(STATUS.SUCCESS, "Attributes retrieved", data);
      } catch (err) {
        debugError("ATTRIBUTE:SEARCH:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error searching attributes", [], err as Error);
      }
    }),

  /**
   * Create a new attribute
   */
  create: staffProcedure
    .input(attributeContract.create.input)
    .output(attributeContract.create.output)
    .mutation(async ({ input }) => {
      try {
        const existing = await db.query.attribute.findFirst({
          where: (a, { and, eq, isNull }) => and(eq(a.slug, input.body.slug), isNull(a.deletedAt)),
          columns: { id: true },
        });
        if (existing) {
          return API_RESPONSE(STATUS.FAILED, "Attribute slug already exists", null);
        }

        const [newAttribute] = await db
          .insert(attribute)
          .values({
            id: uuidv4(),
            ...input.body,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();

        return API_RESPONSE(STATUS.SUCCESS, "Attribute created", newAttribute);
      } catch (err) {
        debugError("ATTRIBUTE:CREATE:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error creating attribute", null, err as Error);
      }
    }),

  /**
   * Update an attribute
   */
  update: staffProcedure
    .input(attributeContract.update.input)
    .output(attributeContract.update.output)
    .mutation(async ({ input }) => {
      try {
        const { id } = input.params;

        if (input.body.slug) {
          const existing = await db.query.attribute.findFirst({
            where: (a, { and, eq, ne, isNull }) => and(eq(a.slug, input.body.slug!), ne(a.id, id), isNull(a.deletedAt)),
            columns: { id: true },
          });
          if (existing) {
            return API_RESPONSE(STATUS.FAILED, "Attribute slug already exists", null);
          }
        }

        const [updatedAttribute] = await db
          .update(attribute)
          .set({
            ...input.body,
            updatedAt: new Date(),
          })
          .where(eq(attribute.id, id))
          .returning();

        if (!updatedAttribute) {
          return API_RESPONSE(STATUS.FAILED, "Attribute not found", null);
        }

        return API_RESPONSE(STATUS.SUCCESS, "Attribute updated", updatedAttribute);
      } catch (err) {
        debugError("ATTRIBUTE:UPDATE:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error updating attribute", null, err as Error);
      }
    }),

  /**
   * Delete an attribute
   */
  delete: staffProcedure
    .input(attributeContract.delete.input)
    .output(attributeContract.delete.output)
    .mutation(async ({ input }) => {
      try {
        const { id } = input.params;

        await db
          .update(attribute)
          .set({
            deletedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(attribute.id, id));

        return API_RESPONSE(STATUS.SUCCESS, "Attribute deleted", null);
      } catch (err) {
        debugError("ATTRIBUTE:DELETE:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error deleting attribute", null, err as Error);
      }
    }),
});
