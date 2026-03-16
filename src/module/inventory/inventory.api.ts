import { and, eq, gt, ilike, isNull, lte, or, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { createTRPCRouter, publicProcedure, staffProcedure } from "@/core/api/api.methods";

import { db } from "@/core/db/db";
import { inventoryAdjustmentEvent, inventoryItem } from "@/core/db/db.schema";
import { STATUS } from "@/shared/config/api.config";
import { API_RESPONSE } from "@/shared/config/api.utils";
import { buildPagination, buildPaginationMeta } from "@/shared/schema";
import { inventoryContract } from "./inventory.schema";

type InventoryDbLike = typeof db;

/**
 * Helper: adjust inventory for a product return/refund in a specific warehouse.
 * Ensures quantity changes are logged via `inventory_adjustment_event` with type "return"
 * and correct `warehouseId`, `orderId`, and `refundId` wiring.
 */
export async function adjustInventoryForReturn(
  tx: InventoryDbLike,
  params: {
    variantId: string;
    warehouseId: string;
    quantity: number;
    orderId?: string | null;
    refundId?: string | null;
    reason?: string | null;
    adjustedBy?: string | null;
  },
) {
  const { variantId, warehouseId, quantity, orderId, refundId, reason, adjustedBy } = params;

  if (quantity <= 0) {
    throw new Error("Return quantity must be a positive integer");
  }

  // Find existing inventory item for this variant and warehouse (ignoring soft-deleted rows)
  let current = await tx.query.inventoryItem.findFirst({
    where: (inv, { and, eq, isNull }) =>
      and(eq(inv.variantId, variantId), eq(inv.warehouseId, warehouseId), isNull(inv.deletedAt)),
  });

  // If no row exists yet for this variant+warehouse, create a zeroed inventory item first
  if (!current) {
    const [created] = await tx
      .insert(inventoryItem)
      .values({
        id: uuidv4(),
        variantId,
        warehouseId,
        // SKU is non-nullable; for system-created rows without a canonical SKU yet,
        // fall back to an empty string. This can be refined later when SKU strategy is defined.
        sku: "",
        barcode: null,
        quantity: 0,
        incoming: 0,
        reserved: 0,
      })
      .returning();

    current = created;
  }

  if (!current) {
    throw new Error("Failed to load or create inventory for return");
  }

  const quantityBefore = current.quantity;
  const incomingBefore = current.incoming;
  const reservedBefore = current.reserved;

  const quantityAfter = quantityBefore + quantity;

  const [updated] = await tx
    .update(inventoryItem)
    .set({
      quantity: quantityAfter,
      updatedAt: new Date(),
    })
    .where(eq(inventoryItem.id, current.id))
    .returning();

  if (!updated) {
    throw new Error("Failed to update inventory for return");
  }

  await tx.insert(inventoryAdjustmentEvent).values({
    id: uuidv4(),
    type: "return",
    inventoryId: updated.id,
    warehouseId: updated.warehouseId ?? warehouseId,
    variantId: updated.variantId,
    quantityBefore,
    quantityDelta: quantity,
    quantityAfter,
    incomingBefore,
    incomingDelta: 0,
    incomingAfter: incomingBefore,
    reservedBefore,
    reservedDelta: 0,
    reservedAfter: reservedBefore,
    orderId: orderId ?? null,
    refundId: refundId ?? null,
    reason: reason ?? null,
    adjustedBy: adjustedBy ?? null,
    createdAt: new Date(),
  });

  return updated;
}

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
            const { and, ilike, isNull, isNotNull, or, gt: _gt, lte: _lte } = helpers;
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

            // Warehouse presence
            if (query?.warehousePresence === "assigned") {
              conditions.push(isNotNull(inv.warehouseId));
            } else if (query?.warehousePresence === "unassigned") {
              conditions.push(isNull(inv.warehouseId));
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
  // GET MOVEMENTS (ADJUSTMENT EVENTS)
  // =========================
  getMovements: staffProcedure
    .input(inventoryContract.getMovements.input)
    .output(inventoryContract.getMovements.output)
    .query(async ({ input }) => {
      try {
        const {
          params: { inventoryId },
          query,
        } = input;

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

        const [{ count: totalRaw = 0 } = { count: 0 }] = await db
          .select({ count: sql<number>`count(*)` })
          .from(inventoryAdjustmentEvent)
          .where(and(eq(inventoryAdjustmentEvent.inventoryId, inventoryId)));

        const total = Number(totalRaw ?? 0);

        const output = await db
          .select()
          .from(inventoryAdjustmentEvent)
          .where(and(eq(inventoryAdjustmentEvent.inventoryId, inventoryId)))
          .orderBy(sql`${inventoryAdjustmentEvent.createdAt} DESC`)
          .limit(Math.min(effectiveLimit, 100))
          .offset(effectiveOffset);

        const metaPagination = buildPaginationMeta(total, pageInput);

        return {
          status: output?.length ? STATUS.SUCCESS : STATUS.FAILED,
          message: output?.length ? "Inventory movements fetched successfully" : "No movements found",
          data: output,
          meta: {
            count: total,
            pagination: metaPagination,
          },
        };
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, "Error fetching inventory movements", null, err as Error);
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

        const result = await db.transaction(async (tx) => {
          const [created] = await tx
            .insert(inventoryItem)
            .values({
              id,
              variantId: data.variantId,
              warehouseId: data.warehouseId ?? null,
              sku: data.sku,
              barcode: data.barcode ?? null,
              quantity: data.quantity ?? 0,
              incoming: data.incoming ?? 0,
              reserved: data.reserved ?? 0,
            })
            .returning();

          if (!created) {
            return { created: null };
          }

          const hasNonZero =
            (created.quantity ?? 0) !== 0 || (created.incoming ?? 0) !== 0 || (created.reserved ?? 0) !== 0;

          if (hasNonZero) {
            await tx.insert(inventoryAdjustmentEvent).values({
              id: uuidv4(),
              type: "manual",
              inventoryId: created.id,
              warehouseId: created.warehouseId ?? null,
              variantId: created.variantId,
              quantityBefore: 0,
              quantityDelta: created.quantity,
              quantityAfter: created.quantity,
              incomingBefore: 0,
              incomingDelta: created.incoming,
              incomingAfter: created.incoming,
              reservedBefore: 0,
              reservedDelta: created.reserved,
              reservedAfter: created.reserved,
              createdAt: new Date(),
            });
          }

          return { created };
        });

        if (!result.created) {
          return API_RESPONSE(STATUS.FAILED, "Failed to create inventory", null);
        }

        return API_RESPONSE(STATUS.SUCCESS, "Inventory created successfully", result.created);
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

        const result = await db.transaction(async (tx) => {
          const existing = await tx.query.inventoryItem.findFirst({
            where: (inv, { and, eq, isNull }) => and(eq(inv.id, id), isNull(inv.deletedAt)),
          });
          if (!existing) {
            return { status: STATUS.FAILED, message: "Inventory not found", updated: null };
          }

          const nextNumbers = {
            quantity: data.quantity ?? existing.quantity,
            incoming: data.incoming ?? existing.incoming,
            reserved: data.reserved ?? existing.reserved,
          };

          const message = validateInventoryNumbers(nextNumbers);
          if (message) {
            return { status: STATUS.FAILED, message, updated: null };
          }

          const updateData: Record<string, unknown> = {};
          if (data.sku !== undefined) updateData.sku = data.sku;
          if (data.barcode !== undefined) updateData.barcode = data.barcode;
          if (data.quantity !== undefined) updateData.quantity = data.quantity;
          if (data.incoming !== undefined) updateData.incoming = data.incoming;
          if (data.reserved !== undefined) updateData.reserved = data.reserved;

          const [updated] = await tx
            .update(inventoryItem)
            .set({ ...updateData, updatedAt: new Date() })
            .where(eq(inventoryItem.id, id))
            .returning();

          if (!updated) {
            return { status: STATUS.FAILED, message: "Failed to update inventory", updated: null };
          }

          const quantityDelta = updated.quantity - existing.quantity;
          const incomingDelta = updated.incoming - existing.incoming;
          const reservedDelta = updated.reserved - existing.reserved;

          if (quantityDelta !== 0 || incomingDelta !== 0 || reservedDelta !== 0) {
            await tx.insert(inventoryAdjustmentEvent).values({
              id: uuidv4(),
              type: "manual",
              inventoryId: updated.id,
              warehouseId: updated.warehouseId ?? null,
              variantId: updated.variantId,
              quantityBefore: existing.quantity,
              quantityDelta,
              quantityAfter: updated.quantity,
              incomingBefore: existing.incoming,
              incomingDelta,
              incomingAfter: updated.incoming,
              reservedBefore: existing.reserved,
              reservedDelta,
              reservedAfter: updated.reserved,
              createdAt: new Date(),
            });
          }

          return { status: STATUS.SUCCESS, message: "Inventory updated successfully", updated };
        });

        return API_RESPONSE(result.status, result.message, result.updated);
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

        const result = await db.transaction(async (tx) => {
          const currentInventory = await tx.query.inventoryItem.findFirst({
            where: (inv, { and, eq, isNull }) => and(eq(inv.id, id), isNull(inv.deletedAt)),
          });

          if (!currentInventory) {
            return { status: STATUS.FAILED, message: "Inventory not found", updated: null };
          }

          if (quantity < 0 || (incoming !== undefined && incoming < 0)) {
            return { status: STATUS.FAILED, message: "Quantity values cannot be negative", updated: null };
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
            return {
              status: STATUS.FAILED,
              message: "New quantity cannot be less than reserved quantity",
              updated: null,
            };
          }

          const [updated] = await tx
            .update(inventoryItem)
            .set({
              quantity: newQuantity,
              incoming: incoming ?? currentInventory.incoming,
              updatedAt: new Date(),
            })
            .where(eq(inventoryItem.id, id))
            .returning();

          if (!updated) {
            return { status: STATUS.FAILED, message: "Failed to update stock", updated: null };
          }

          const quantityDelta = updated.quantity - currentInventory.quantity;
          const incomingDelta = updated.incoming - currentInventory.incoming;

          if (quantityDelta !== 0 || incomingDelta !== 0) {
            await tx.insert(inventoryAdjustmentEvent).values({
              id: uuidv4(),
              type: "manual",
              inventoryId: updated.id,
              warehouseId: updated.warehouseId ?? null,
              variantId: updated.variantId,
              quantityBefore: currentInventory.quantity,
              quantityDelta,
              quantityAfter: updated.quantity,
              incomingBefore: currentInventory.incoming,
              incomingDelta,
              incomingAfter: updated.incoming,
              reservedBefore: currentInventory.reserved,
              reservedDelta: 0,
              reservedAfter: currentInventory.reserved,
              createdAt: new Date(),
            });
          }

          return { status: STATUS.SUCCESS, message: "Stock updated successfully", updated };
        });

        return API_RESPONSE(result.status, result.message, result.updated);
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
