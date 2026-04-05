import { and, eq, gt, isNull, lt, or, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import type z from "zod/v3";
import { adminProcedure, createTRPCRouter, customerProcedure, staffProcedure } from "@/core/api/api.methods";
import { db } from "@/core/db/db";
import { discount, discountUsageEvent } from "@/core/db/db.schema";
import { MESSAGE, STATUS } from "@/shared/config/api.config";
import { API_RESPONSE } from "@/shared/config/api.utils";
import { buildPaginationMeta } from "@/shared/schema";
import { debugError } from "@/shared/utils/lib/logger.utils";
import { type Discount, discountContract, type discountListInputSchema } from "./discount.schema";

function isExpired(row: Discount, now: Date) {
  return !!row.expiresAt && row.expiresAt.getTime() < now.getTime();
}

export const discountRouter = createTRPCRouter({
  // ----------------------
  // Admin / staff listing
  // ----------------------
  list: staffProcedure
    .input(discountContract.list.input)
    .output(discountContract.list.output)
    .query(async ({ input }) => {
      try {
        const query = (input?.query ?? {}) as z.infer<typeof discountListInputSchema>["query"];
        const limit = query?.limit ?? 20;
        const offset = query?.offset ?? 0;

        const now = new Date();

        const whereClauses = [
          query?.code ? sql`${discount.code} ILIKE ${"%" + query.code + "%"}` : undefined,
          query?.type ? eq(discount.type, query.type) : undefined,
          typeof query?.isActive === "boolean" ? eq(discount.isActive, query.isActive) : undefined,
          query?.isExpired === true ? lt(discount.expiresAt, now) : undefined,
          query?.isExpired === false ? or(isNull(discount.expiresAt), gt(discount.expiresAt, now)) : undefined,
        ].filter((c): c is NonNullable<typeof c> => Boolean(c));

        const where = whereClauses.length ? and(...whereClauses) : undefined;

        const [{ count: totalRaw = 0 } = { count: 0 }] = await db
          .select({ count: sql<number>`count(*)` })
          .from(discount)
          .where(where);
        const total = Number(totalRaw ?? 0);

        const rows = await db.query.discount.findMany({
          where,
          orderBy: (d, { desc }) => [desc(d.createdAt)],
          limit,
          offset,
        });

        const pageInput = {
          page: Math.floor(offset / limit) + 1,
          limit,
          sortBy: undefined as string | undefined,
          sortOrder: "desc" as const,
        };
        const metaPagination = buildPaginationMeta(total, pageInput);

        return {
          status: STATUS.SUCCESS,
          message: MESSAGE.DISCOUNT.GET_MANY.SUCCESS,
          data: rows,
          meta: {
            count: total,
            pagination: metaPagination,
          },
        };
      } catch (err) {
        debugError("DISCOUNT:LIST:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, MESSAGE.DISCOUNT.GET_MANY.ERROR, null, err as Error);
      }
    }),

  // ----------------------
  // Admin CRUD
  // ----------------------

  create: adminProcedure
    .input(discountContract.create.input)
    .output(discountContract.create.output)
    .mutation(async ({ input }) => {
      try {
        const { body } = input;

        const [created] = await db
          .insert(discount)
          .values({
            id: uuidv4(),
            code: body.code,
            type: body.type,
            value: body.value,
            minOrderAmount: body.minOrderAmount ?? 0,
            maxUses: body.maxUses ?? null,
            usedCount: 0,
            expiresAt: body.expiresAt ?? null,
            isActive: body.isActive ?? true,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();

        return API_RESPONSE(STATUS.SUCCESS, MESSAGE.DISCOUNT.CREATE.SUCCESS, created);
      } catch (err) {
        debugError("DISCOUNT:CREATE:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, MESSAGE.DISCOUNT.CREATE.ERROR, null, err as Error);
      }
    }),

  update: adminProcedure
    .input(discountContract.update.input)
    .output(discountContract.update.output)
    .mutation(async ({ input }) => {
      try {
        const { id } = input.params;
        const { body } = input;

        const [updated] = await db
          .update(discount)
          .set({
            ...body,
            updatedAt: new Date(),
          })
          .where(eq(discount.id, id))
          .returning();

        if (!updated) {
          return API_RESPONSE(STATUS.FAILED, MESSAGE.DISCOUNT.UPDATE.FAILED, null);
        }

        return API_RESPONSE(STATUS.SUCCESS, MESSAGE.DISCOUNT.UPDATE.SUCCESS, updated);
      } catch (err) {
        debugError("DISCOUNT:UPDATE:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, MESSAGE.DISCOUNT.UPDATE.ERROR, null, err as Error);
      }
    }),

  // ----------------------
  // Customer: validate code for a cart subtotal
  // ----------------------

  validateAndPrice: customerProcedure
    .input(discountContract.validateAndPrice.input)
    .output(discountContract.validateAndPrice.output)
    .query(async ({ input, ctx }) => {
      try {
        const { code, cartSubtotal } = input.body;
        const userId = ctx.user.id;
        const now = new Date();

        const row = await db.query.discount.findFirst({
          where: (d, { and: andLocal, eq: eqLocal }) => andLocal(eqLocal(d.code, code), eqLocal(d.isActive, true)),
        });

        if (!row || isExpired(row as Discount, now)) {
          return API_RESPONSE(STATUS.FAILED, MESSAGE.DISCOUNT.VALIDATE_CODE.FAILED, null);
        }

        const minOrderAmount = row.minOrderAmount ?? 0;
        const maxUses = row.maxUses ?? null;
        const usedCount = row.usedCount ?? 0;

        if (minOrderAmount && cartSubtotal < minOrderAmount) {
          return API_RESPONSE(
            STATUS.FAILED,
            "Order amount does not meet the minimum required for this discount.",
            null,
          );
        }

        if (maxUses && usedCount >= maxUses) {
          return API_RESPONSE(STATUS.FAILED, "This discount code has reached its maximum usage limit.", null);
        }

        let appliedAmount = 0;

        if (row.type === "percent") {
          const basisPoints = row.value; // e.g. 1000 => 10%
          appliedAmount = Math.floor((cartSubtotal * basisPoints) / 10000);
        } else if (row.type === "flat") {
          appliedAmount = Math.min(row.value, cartSubtotal);
        } else {
          // For unsupported types in v1, fail gracefully
          return API_RESPONSE(STATUS.FAILED, "This discount type is not yet supported at checkout.", null);
        }

        if (appliedAmount <= 0) {
          return API_RESPONSE(STATUS.FAILED, "This discount cannot be applied to the current cart total.", null);
        }

        const payload = {
          code: row.code,
          type: row.type as Discount["type"],
          appliedAmount,
          message: "Discount code applied successfully.",
        };

        return API_RESPONSE(STATUS.SUCCESS, MESSAGE.DISCOUNT.VALIDATE_CODE.SUCCESS, payload);
      } catch (err) {
        debugError("DISCOUNT:VALIDATE_AND_PRICE:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, MESSAGE.DISCOUNT.VALIDATE_CODE.ERROR, null, err as Error);
      }
    }),
});
