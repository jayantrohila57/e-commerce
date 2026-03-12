import { and, eq, gt, ilike, isNull, lte, or, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { createTRPCRouter, publicProcedure, staffProcedure } from "@/core/api/api.methods";

import { db } from "@/core/db/db";
import { inventoryItem } from "@/core/db/db.schema";
import { STATUS } from "@/shared/config/api.config";
import { API_RESPONSE } from "@/shared/config/api.utils";
import { buildPagination, buildPaginationMeta } from "@/shared/schema";
import { inventoryContract } from "./inventory.schema";

function validateInventoryNumbers(input: { quantity: number; reserved: number; incoming: number }) {
  if (input.quantity < 0 || input.reserved < 0 || input.incoming < 0) {
    return "Inventory values cannot be negative";
  }
  if (input.reserved > input.quantity) {
    return "Reserved quantity cannot exceed available quantity";
  }
  return null;
}

export const inventoryRouter = createTRPCRouter({
  // =========================
  // GET ONE BY ID OR SKU
  // =========================
  get: staffProcedure
    .input(inventoryContract.get.input)
    .output(inventoryContract.get.output)
    .query(async ({ input }) => {
      try {
        const { id, sku } = input.params;

        if (!id && !sku) {
          return API_RESPONSE(STATUS.FAILED, "Failed to fetch inventory", null);
        }

        const output = await db.query.inventoryItem.findFirst({
          where: (inv, { and, eq, isNull }) => {
            const conditions = [isNull(inv.deletedAt)];
            if (id) conditions.push(eq(inv.id, id));
            if (sku) conditions.push(eq(inv.sku, sku));
            return and(...conditions);
          },
        });

        return API_RESPONSE(
          output ? STATUS.SUCCESS : STATUS.FAILED,
          output ? "Inventory fetched successfully" : "Failed to fetch inventory",
          output ?? null,
        );
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, "Error fetching inventory", null, err as Error);
      }
    }),

  // =========================
  // GET MANY
  // =========================
  getMany: staffProcedure
    .input(inventoryContract.getMany.input)
    .output(inventoryContract.getMany.output)
    .query(async ({ input }) => {
      try {
        const { query } = input;
        const limit = query?.limit ?? 20;
        const offset = query?.offset ?? 0;

        const pageInput = {
          page: Math.floor(offset / limit) + 1,
          limit,
          sortBy: undefined as string | undefined,
          sortOrder: "desc" as const,
        };

        const paging = buildPagination(pageInput);
        const effectiveOffset = paging.offset;
        const effectiveLimit = paging.limit;

        const baseConditions = [
          isNull(inventoryItem.deletedAt),
          query?.search
            ? or(ilike(inventoryItem.sku, `%${query.search}%`), ilike(inventoryItem.barcode, `%${query.search}%`))
            : undefined,
        ].filter((c): c is NonNullable<typeof c> => Boolean(c));

        const [{ count: totalRaw = 0 } = { count: 0 }] = await db
          .select({ count: sql<number>`count(*)` })
          .from(inventoryItem)
          .where(baseConditions.length ? and(...baseConditions) : undefined);
        const total = Number(totalRaw ?? 0);

        const output = await db.query.inventoryItem.findMany({
          where: (inv, helpers) => {
            const { and, ilike, isNull, or, gt: _gt, lte: _lte } = helpers;
            const conditions = [isNull(inv.deletedAt)];
            if (query?.search) {
              conditions.push(or(ilike(inv.sku, `%${query.search}%`), ilike(inv.barcode, `%${query.search}%`))!);
            }

            // Stock status (simple heuristic: low_stock <= 5 and >0)
            if (query?.stockStatus === "in_stock") {
              conditions.push(_gt(inv.quantity, 0));
            } else if (query?.stockStatus === "low_stock") {
              conditions.push(_gt(inv.quantity, 0), _lte(inv.quantity, 5));
            } else if (query?.stockStatus === "out_of_stock") {
              conditions.push(_lte(inv.quantity, 0));
            }

            // Reserved
            if (query?.hasReserved === true) {
              conditions.push(_gt(inv.reserved, 0));
            } else if (query?.hasReserved === false) {
              conditions.push(_lte(inv.reserved, 0));
            }

            // Incoming
            if (query?.hasIncoming === true) {
              conditions.push(_gt(inv.incoming, 0));
            } else if (query?.hasIncoming === false) {
              conditions.push(_lte(inv.incoming, 0));
            }

            return and(...conditions);
          },
          limit: Math.min(effectiveLimit, 100),
          offset: effectiveOffset,
          orderBy: (inv, { desc }) => [desc(inv.updatedAt)],
        });

        const metaPagination = buildPaginationMeta(total, pageInput);

        return {
          status: output?.length ? STATUS.SUCCESS : STATUS.FAILED,
          message: output?.length ? "Inventories fetched successfully" : "No inventories found",
          data: output,
          meta: {
            count: total,
            pagination: metaPagination,
          },
        };
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, "Error fetching inventories", null, err as Error);
      }
    }),

  // =========================
  // GET BY VARIANT ID
  // =========================
  getByVariantId: publicProcedure
    .input(inventoryContract.getByVariantId.input)
    .output(inventoryContract.getByVariantId.output)
    .query(async ({ input }) => {
      try {
        const { variantId } = input.params;

        const output = await db.query.inventoryItem.findFirst({
          where: (inv, { and, eq, isNull }) => and(eq(inv.variantId, variantId), isNull(inv.deletedAt)),
        });

        return API_RESPONSE(
          output ? STATUS.SUCCESS : STATUS.FAILED,
          output ? "Inventory fetched successfully" : "Failed to fetch inventory",
          output ?? null,
        );
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, "Error fetching inventory", null, err as Error);
      }
    }),

  // =========================
  // GET BY SKU
  // =========================
  getBySku: publicProcedure
    .input(inventoryContract.getBySku.input)
    .output(inventoryContract.getBySku.output)
    .query(async ({ input }) => {
      try {
        const { sku } = input.params;

        const output = await db.query.inventoryItem.findFirst({
          where: (inv, { and, eq, isNull }) => and(eq(inv.sku, sku), isNull(inv.deletedAt)),
        });

        return API_RESPONSE(
          output ? STATUS.SUCCESS : STATUS.FAILED,
          output ? "Inventory fetched successfully" : "Failed to fetch inventory",
          output ?? null,
        );
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, "Error fetching inventory", null, err as Error);
      }
    }),

  // =========================
  // CREATE
  // =========================
  create: staffProcedure
    .input(inventoryContract.create.input)
    .output(inventoryContract.create.output)
    .mutation(async ({ input }) => {
      try {
        const { data } = input;
        const id = uuidv4();

        const message = validateInventoryNumbers({
          quantity: data.quantity ?? 0,
          incoming: data.incoming ?? 0,
          reserved: data.reserved ?? 0,
        });
        if (message) {
          return API_RESPONSE(STATUS.FAILED, message, null);
        }

        const output = await db
          .insert(inventoryItem)
          .values({
            id,
            variantId: data.variantId,
            sku: data.sku,
            barcode: data.barcode ?? null,
            quantity: data.quantity ?? 0,
            incoming: data.incoming ?? 0,
            reserved: data.reserved ?? 0,
          })
          .returning();

        return API_RESPONSE(
          output?.length ? STATUS.SUCCESS : STATUS.FAILED,
          output?.length ? "Inventory created successfully" : "Failed to create inventory",
          output?.[0] ?? null,
        );
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, "Error creating inventory", null, err as Error);
      }
    }),

  // =========================
  // UPDATE
  // =========================
  update: staffProcedure
    .input(inventoryContract.update.input)
    .output(inventoryContract.update.output)
    .mutation(async ({ input }) => {
      try {
        const { id } = input.params;
        const { data } = input;

        const existing = await db.query.inventoryItem.findFirst({
          where: (inv, { and, eq, isNull }) => and(eq(inv.id, id), isNull(inv.deletedAt)),
        });
        if (!existing) {
          return API_RESPONSE(STATUS.FAILED, "Inventory not found", null);
        }

        const next = {
          quantity: data.quantity ?? existing.quantity,
          incoming: data.incoming ?? existing.incoming,
          reserved: data.reserved ?? existing.reserved,
        };

        const message = validateInventoryNumbers(next);
        if (message) {
          return API_RESPONSE(STATUS.FAILED, message, null);
        }

        const updateData: Record<string, unknown> = {};
        if (data.sku !== undefined) updateData.sku = data.sku;
        if (data.barcode !== undefined) updateData.barcode = data.barcode;
        if (data.quantity !== undefined) updateData.quantity = data.quantity;
        if (data.incoming !== undefined) updateData.incoming = data.incoming;
        if (data.reserved !== undefined) updateData.reserved = data.reserved;

        const output = await db
          .update(inventoryItem)
          .set({ ...updateData, updatedAt: new Date() })
          .where(eq(inventoryItem.id, id))
          .returning();

        return API_RESPONSE(
          output?.length ? STATUS.SUCCESS : STATUS.FAILED,
          output?.length ? "Inventory updated successfully" : "Failed to update inventory",
          output?.[0] ?? null,
        );
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, "Error updating inventory", null, err as Error);
      }
    }),

  // =========================
  // DELETE
  // =========================
  delete: staffProcedure
    .input(inventoryContract.delete.input)
    .output(inventoryContract.delete.output)
    .mutation(async ({ input }) => {
      try {
        const { id } = input.params;

        const existing = await db.query.inventoryItem.findFirst({
          where: (inv, { and, eq, isNull }) => and(eq(inv.id, id), isNull(inv.deletedAt)),
        });
        if (!existing) {
          return API_RESPONSE(STATUS.FAILED, "Inventory not found", { deleted: false });
        }

        if (existing.reserved > 0) {
          return API_RESPONSE(STATUS.FAILED, "Cannot delete inventory while items are reserved in carts", {
            deleted: false,
          });
        }

        const result = await db
          .update(inventoryItem)
          .set({ deletedAt: new Date(), updatedAt: new Date() })
          .where(eq(inventoryItem.id, id))
          .returning();

        return API_RESPONSE(
          result?.length ? STATUS.SUCCESS : STATUS.FAILED,
          result?.length ? "Inventory deleted successfully" : "Failed to delete inventory",
          { deleted: result?.length > 0 },
        );
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, "Error deleting inventory", null, err as Error);
      }
    }),

  // =========================
  // UPDATE STOCK
  // =========================
  updateStock: staffProcedure
    .input(inventoryContract.updateStock.input)
    .output(inventoryContract.updateStock.output)
    .mutation(async ({ input }) => {
      try {
        const { id } = input.params;
        const { quantity, type, incoming } = input.data;

        // Get current inventory
        const currentInventory = await db.query.inventoryItem.findFirst({
          where: (inv, { and, eq, isNull }) => and(eq(inv.id, id), isNull(inv.deletedAt)),
        });

        if (!currentInventory) {
          return API_RESPONSE(STATUS.FAILED, "Inventory not found", null);
        }

        if (quantity < 0 || (incoming !== undefined && incoming < 0)) {
          return API_RESPONSE(STATUS.FAILED, "Quantity values cannot be negative", null);
        }

        let newQuantity = currentInventory.quantity;

        if (type === "add") {
          newQuantity = currentInventory.quantity + quantity;
        } else if (type === "subtract") {
          newQuantity = Math.max(0, currentInventory.quantity - quantity);
        } else if (type === "set") {
          newQuantity = quantity;
        }

        if (newQuantity < currentInventory.reserved) {
          return API_RESPONSE(STATUS.FAILED, "New quantity cannot be less than reserved quantity", null);
        }

        const output = await db
          .update(inventoryItem)
          .set({
            quantity: newQuantity,
            incoming: incoming ?? currentInventory.incoming,
            updatedAt: new Date(),
          })
          .where(eq(inventoryItem.id, id))
          .returning();

        return API_RESPONSE(
          output?.length ? STATUS.SUCCESS : STATUS.FAILED,
          output?.length ? "Stock updated successfully" : "Failed to update stock",
          output?.[0] ?? null,
        );
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, "Error updating stock", null, err as Error);
      }
    }),

  // =========================
  // SEARCH
  // =========================
  search: staffProcedure
    .input(inventoryContract.search.input)
    .output(inventoryContract.search.output)
    .query(async ({ input }) => {
      try {
        const { query } = input;
        const limit = query?.limit ?? 20;
        const offset = query?.offset ?? 0;

        // build where clause inline so we don't need a typed array
        const output = await db.query.inventoryItem.findMany({
          where: query?.search ? ilike(inventoryItem.sku, `%${query.search}%`) : undefined,
          limit: Math.min(limit, 100),
          offset,
          orderBy: (inv, { desc }) => [desc(inv.updatedAt)],
        });

        return API_RESPONSE(STATUS.SUCCESS, "Inventories searched successfully", output);
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, "Error searching inventories", null, err as Error);
      }
    }),
});
