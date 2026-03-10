import { and, eq, isNull, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { createTRPCRouter, customerProcedure, publicProcedure, staffProcedure } from "@/core/api/api.methods";
import { db } from "@/core/db/db";
import { review } from "@/core/db/db.schema";
import { MESSAGE, STATUS } from "@/shared/config/api.config";
import { API_RESPONSE } from "@/shared/config/api.utils";
import { buildPagination, buildPaginationMeta } from "@/shared/schema";
import { debugError } from "@/shared/utils/lib/logger.utils";
import { reviewContract } from "./review.schema";

export const reviewRouter = createTRPCRouter({
  create: customerProcedure
    .input(reviewContract.create.input)
    .output(reviewContract.create.output)
    .mutation(async ({ input, ctx }) => {
      try {
        const { body } = input;
        const userId = ctx.user.id;

        const [output] = await db
          .insert(review)
          .values({
            id: uuidv4(),
            userId,
            productId: body.productId,
            rating: body.rating,
            title: body.title ?? null,
            comment: body.content ?? null,
            isApproved: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();

        return API_RESPONSE(
          output ? STATUS.SUCCESS : STATUS.FAILED,
          output ? MESSAGE.REVIEW.CREATE.SUCCESS : MESSAGE.REVIEW.CREATE.FAILED,
          output,
        );
      } catch (err) {
        debugError("REVIEW:CREATE:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, MESSAGE.REVIEW.CREATE.ERROR, null, err as Error);
      }
    }),

  getMany: publicProcedure
    .input(reviewContract.getMany.input)
    .output(reviewContract.getMany.output)
    .query(async ({ input }) => {
      try {
        const { query } = input;
        const { limit, offset, productId, userId, isApproved } = query;

        const conditions = [];
        if (productId) conditions.push(eq(review.productId, productId));
        if (userId) conditions.push(eq(review.userId, userId));
        if (isApproved !== undefined) conditions.push(eq(review.isApproved, isApproved));

        const where = conditions.length ? and(...conditions) : undefined;

        const pageInput = {
          page: offset && limit ? Math.floor(offset / limit) + 1 : 1,
          limit: limit ?? 20,
          sortBy: undefined,
          sortOrder: "desc" as const,
        };

        const paging = buildPagination(pageInput);
        const effectiveOffset = offset ?? paging.offset;
        const effectiveLimit = paging.limit;

        const [{ count: totalRaw = 0 } = { count: 0 }] = await db
          .select({ count: sql<number>`count(*)` })
          .from(review)
          .where(where);
        const total = Number(totalRaw ?? 0);

        const reviews = await db.query.review.findMany({
          limit: effectiveLimit,
          offset: effectiveOffset,
          where,
          orderBy: (r, { desc }) => [desc(r.createdAt)],
        });

        const metaPagination = buildPaginationMeta(total, pageInput);

        return {
          status: STATUS.SUCCESS,
          message: MESSAGE.REVIEW.GET_MANY.SUCCESS,
          data: reviews,
          meta: {
            count: total,
            pagination: metaPagination,
          },
        };
      } catch (err) {
        debugError("REVIEW:GET_MANY:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, MESSAGE.REVIEW.GET_MANY.ERROR, [], err as Error);
      }
    }),
});
