import { and, desc, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { createTRPCRouter, customerProcedure } from "@/core/api/api.methods";
import { db } from "@/core/db/db";
import { address } from "@/core/db/db.schema";
import { MESSAGE, STATUS } from "@/shared/config/api.config";
import { API_RESPONSE } from "@/shared/config/api.utils";
import { debugError } from "@/shared/utils/lib/logger.utils";
import { type Address, addressContract } from "./address.schema";

function mapAddress(row: (typeof address)["_"]["inferSelect"]): Address {
  return {
    id: row.id,
    userId: row.userId,
    type: row.type,
    line1: row.line1,
    line2: row.line2 ?? undefined,
    city: row.city,
    state: row.state,
    postalCode: row.postalCode,
    country: row.country,
    isDefault: row.isDefault,
    createdAt: row.createdAt ?? undefined,
    updatedAt: row.updatedAt ?? undefined,
  };
}

export const addressRouter = createTRPCRouter({
  /**
   * Get all addresses for the authenticated user
   */
  getMany: customerProcedure
    .input(addressContract.getMany.input)
    .output(addressContract.getMany.output)
    .query(async ({ ctx }) => {
      try {
        const userId = ctx.user.id;

        const rows = await db.query.address.findMany({
          where: eq(address.userId, userId),
          orderBy: (address, { desc }) => [desc(address.isDefault), desc(address.createdAt)],
        });

        const data: Address[] = rows.map(mapAddress);

        return API_RESPONSE(STATUS.SUCCESS, "Addresses retrieved successfully", data);
      } catch (err) {
        debugError("ADDRESS:GET_MANY:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error retrieving addresses", [], err as Error);
      }
    }),

  /**
   * Create a new address
   */
  create: customerProcedure
    .input(addressContract.create.input)
    .output(addressContract.create.output)
    .mutation(async ({ input, ctx }) => {
      try {
        const userId = ctx.user.id;
        const addressId = uuidv4();

        // If this is the first address or set as default, unset other defaults
        if (input.body.isDefault) {
          await db.update(address).set({ isDefault: false }).where(eq(address.userId, userId));
        } else {
          // Check if it's the first address
          const count = await db.query.address.findFirst({
            where: eq(address.userId, userId),
          });
          if (!count) {
            input.body.isDefault = true;
          }
        }

        const [newAddress] = await db
          .insert(address)
          .values({
            id: addressId,
            userId,
            ...input.body,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();

        const data: Address = mapAddress(newAddress);

        return API_RESPONSE(STATUS.SUCCESS, "Address created successfully", data);
      } catch (err) {
        debugError("ADDRESS:CREATE:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error creating address", null, err as Error);
      }
    }),

  /**
   * Update an address
   */
  update: customerProcedure
    .input(addressContract.update.input)
    .output(addressContract.update.output)
    .mutation(async ({ input, ctx }) => {
      try {
        const userId = ctx.user.id;
        const { id } = input.params;

        // Verify ownership
        const existing = await db.query.address.findFirst({
          where: and(eq(address.id, id), eq(address.userId, userId)),
        });

        if (!existing) {
          return API_RESPONSE(STATUS.FAILED, "Address not found or unauthorized", null);
        }

        // If setting as default, unset other defaults
        if (input.body.isDefault) {
          await db.update(address).set({ isDefault: false }).where(eq(address.userId, userId));
        }

        const [updatedAddress] = await db
          .update(address)
          .set({
            ...input.body,
            updatedAt: new Date(),
          })
          .where(eq(address.id, id))
          .returning();

        const data: Address = mapAddress(updatedAddress);

        return API_RESPONSE(STATUS.SUCCESS, "Address updated successfully", data);
      } catch (err) {
        debugError("ADDRESS:UPDATE:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error updating address", null, err as Error);
      }
    }),

  /**
   * Delete an address
   */
  delete: customerProcedure
    .input(addressContract.delete.input)
    .output(addressContract.delete.output)
    .mutation(async ({ input, ctx }) => {
      try {
        const userId = ctx.user.id;
        const { id } = input.params;

        // Verify ownership
        const existing = await db.query.address.findFirst({
          where: and(eq(address.id, id), eq(address.userId, userId)),
        });

        if (!existing) {
          return API_RESPONSE(STATUS.FAILED, "Address not found or unauthorized", null);
        }

        await db.delete(address).where(eq(address.id, id));

        // If we deleted the default address, make the most recent one default
        if (existing.isDefault) {
          const nextAddress = await db.query.address.findFirst({
            where: eq(address.userId, userId),
            orderBy: (address, { desc }) => [desc(address.createdAt)],
          });

          if (nextAddress) {
            await db.update(address).set({ isDefault: true }).where(eq(address.id, nextAddress.id));
          }
        }

        return API_RESPONSE(STATUS.SUCCESS, "Address deleted successfully", { id });
      } catch (err) {
        debugError("ADDRESS:DELETE:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error deleting address", null, err as Error);
      }
    }),

  /**
   * Set an address as default
   */
  setDefault: customerProcedure
    .input(addressContract.setDefault.input)
    .output(addressContract.setDefault.output)
    .mutation(async ({ input, ctx }) => {
      try {
        const userId = ctx.user.id;
        const { id } = input.params;

        // Verify ownership
        const existing = await db.query.address.findFirst({
          where: and(eq(address.id, id), eq(address.userId, userId)),
        });

        if (!existing) {
          return API_RESPONSE(STATUS.FAILED, "Address not found or unauthorized", null);
        }

        // Unset other defaults
        await db.update(address).set({ isDefault: false }).where(eq(address.userId, userId));

        // Set this one as default
        const [updatedAddress] = await db
          .update(address)
          .set({ isDefault: true, updatedAt: new Date() })
          .where(eq(address.id, id))
          .returning();

        const data: Address = mapAddress(updatedAddress);

        return API_RESPONSE(STATUS.SUCCESS, "Default address set successfully", data);
      } catch (err) {
        debugError("ADDRESS:SET_DEFAULT:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error setting default address", null, err as Error);
      }
    }),
});
