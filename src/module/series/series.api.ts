import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { createTRPCRouter, staffProcedure } from "@/core/api/api.methods";
import { db } from "@/core/db/db";
import { series } from "@/core/db/db.schema";
import { MESSAGE, STATUS } from "@/shared/config/api.config";
import { API_RESPONSE } from "@/shared/config/api.utils";
import { debugError } from "@/shared/utils/lib/logger.utils";
import { seriesContract } from "./series.schema";

export const seriesRouter = createTRPCRouter({
  getMany: staffProcedure
    .input(seriesContract.getMany.input)
    .output(seriesContract.getMany.output)
    .query(async ({ input }) => {
      try {
        const query = input?.query;
        const { limit = 20, offset = 0, subcategorySlug } = query || {};

        const allSeries = await db.query.series.findMany({
          limit,
          offset,
          where: (s, { eq, and, isNull }) => {
            const conditions = [isNull(s.deletedAt)];
            if (subcategorySlug) conditions.push(eq(s.subcategorySlug, subcategorySlug));
            return and(...conditions);
          },
          orderBy: (s, { desc }) => [desc(s.createdAt)],
        });

        return API_RESPONSE(STATUS.SUCCESS, MESSAGE.SERIES.GET_MANY.SUCCESS, allSeries);
      } catch (err) {
        debugError("SERIES:GET_MANY", err);
        return API_RESPONSE(STATUS.ERROR, MESSAGE.SERIES.GET_MANY.ERROR, null, err as Error);
      }
    }),

  create: staffProcedure
    .input(seriesContract.create.input)
    .output(seriesContract.create.output)
    .mutation(async ({ input }) => {
      try {
        const [output] = await db
          .insert(series)
          .values({
            id: uuidv4(),
            ...input.body,
            slug: input.body.slug ?? input.body.title.toLowerCase().replace(/\s+/g, "-"),
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();

        return API_RESPONSE(
          output ? STATUS.SUCCESS : STATUS.FAILED,
          output ? MESSAGE.SERIES.CREATE.SUCCESS : MESSAGE.SERIES.CREATE.FAILED,
          output,
        );
      } catch (err) {
        debugError("SERIES:CREATE", err);
        return API_RESPONSE(STATUS.ERROR, MESSAGE.SERIES.CREATE.ERROR, null, err as Error);
      }
    }),

  update: staffProcedure
    .input(seriesContract.update.input)
    .output(seriesContract.update.output)
    .mutation(async ({ input }) => {
      try {
        const { params, body } = input;

        const [output] = await db
          .update(series)
          .set({
            ...body,
            updatedAt: new Date(),
          })
          .where(eq(series.id, params.id))
          .returning();

        return API_RESPONSE(
          output ? STATUS.SUCCESS : STATUS.FAILED,
          output ? MESSAGE.SERIES.UPDATE.SUCCESS : MESSAGE.SERIES.UPDATE.FAILED,
          output,
        );
      } catch (err) {
        debugError("SERIES:UPDATE", err);
        return API_RESPONSE(STATUS.ERROR, MESSAGE.SERIES.UPDATE.ERROR, null, err as Error);
      }
    }),

  delete: staffProcedure
    .input(seriesContract.delete.input)
    .output(seriesContract.delete.output)
    .mutation(async ({ input }) => {
      try {
        const [output] = await db
          .update(series)
          .set({
            deletedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(series.id, input.params.id))
          .returning({ id: series.id });

        return API_RESPONSE(
          output ? STATUS.SUCCESS : STATUS.FAILED,
          output ? MESSAGE.SERIES.DELETE.SUCCESS : MESSAGE.SERIES.DELETE.FAILED,
          output,
        );
      } catch (err) {
        debugError("SERIES:DELETE", err);
        return API_RESPONSE(STATUS.ERROR, MESSAGE.SERIES.DELETE.ERROR, null, err as Error);
      }
    }),
});
