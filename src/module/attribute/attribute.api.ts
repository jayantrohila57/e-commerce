import { and, asc, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { createTRPCRouter, publicProcedure, staffProcedure } from "@/core/api/api.methods";
import { db } from "@/core/db/db";
import { attribute } from "@/core/db/db.schema";
import { STATUS } from "@/shared/config/api.config";
import { API_RESPONSE } from "@/shared/config/api.utils";
import { debugError } from "@/shared/utils/lib/logger.utils";
import { attributeContract } from "./attribute.schema";

export const attributeRouter = createTRPCRouter({
  /**
   * Get all attributes, optionally filtered by series
   */
  getMany: publicProcedure
    .input(attributeContract.getMany.input)
    .output(attributeContract.getMany.output)
    .query(async ({ input }) => {
      try {
        const { seriesSlug } = input.query || {};

        const data = await db.query.attribute.findMany({
          where: seriesSlug ? eq(attribute.seriesSlug, seriesSlug) : undefined,
          orderBy: (attribute, { asc }) => [asc(attribute.displayOrder)],
        });

        return API_RESPONSE(STATUS.SUCCESS, "Attributes retrieved", data);
      } catch (err) {
        debugError("ATTRIBUTE:GET_MANY:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error retrieving attributes", [], err as Error);
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

        await db.delete(attribute).where(eq(attribute.id, id));

        return API_RESPONSE(STATUS.SUCCESS, "Attribute deleted", null);
      } catch (err) {
        debugError("ATTRIBUTE:DELETE:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error deleting attribute", null, err as Error);
      }
    }),
});
