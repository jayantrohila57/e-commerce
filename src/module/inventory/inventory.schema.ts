import z from "zod/v3";
import { detailedResponse, offsetPaginationSchema } from "@/shared/schema";

export const inventoryBaseSchema = z.object({
  id: z.string().min(1),
  variantId: z.string().min(1),
  warehouseId: z.string().min(1).optional().nullable(),
  sku: z.string().min(1),
  barcode: z.string().nullable().optional(),
  quantity: z.number().int().min(0),
  incoming: z.number().int().min(0),
  reserved: z.number().int().min(0),
  updatedAt: z
    .date()
    .default(() => new Date())
    .nullable(),
});

export const inventorySelectSchema = inventoryBaseSchema;

export const inventoryInsertSchema = inventoryBaseSchema.omit({
  id: true,
  updatedAt: true,
});

export const inventoryUpdateSchema = inventoryBaseSchema.partial();

export const inventoryMovementSchema = z.object({
  id: z.string().min(1),
  inventoryId: z.string().min(1),
  warehouseId: z.string().min(1).optional().nullable(),
  variantId: z.string().nullable().optional(),
  type: z.enum(["manual", "order", "restock", "return", "damaged", "correction"]),
  quantityBefore: z.number().int().nullable().optional(),
  quantityDelta: z.number().int(),
  quantityAfter: z.number().int().nullable().optional(),
  incomingBefore: z.number().int().nullable().optional(),
  incomingDelta: z.number().int(),
  incomingAfter: z.number().int().nullable().optional(),
  reservedBefore: z.number().int().nullable().optional(),
  reservedDelta: z.number().int(),
  reservedAfter: z.number().int().nullable().optional(),
  orderId: z.string().nullable().optional(),
  refundId: z.string().nullable().optional(),
  reason: z.string().nullable().optional(),
  adjustedBy: z.string().nullable().optional(),
  createdAt: z.date(),
});

export const searchSchema = z.object({
  search: z.string().min(2).max(100).optional(),
  stockStatus: z.enum(["in_stock", "low_stock", "out_of_stock"]).optional(),
  hasReserved: z.boolean().optional(),
  hasIncoming: z.boolean().optional(),
  warehousePresence: z.enum(["assigned", "unassigned"]).optional(),
  warehouseId: z.string().min(1).optional(),
});

export const inventoryContract = {
  get: {
    input: z.object({
      params: z.object({
        id: z.string().optional(),
        sku: z.string().optional(),
      }),
    }),
    output: detailedResponse(inventorySelectSchema.nullable()),
  },

  getMany: {
    input: z.object({
      query: searchSchema.merge(offsetPaginationSchema).optional(),
    }),
    output: detailedResponse(z.array(inventorySelectSchema)),
  },

  getMovements: {
    input: z.object({
      params: z.object({
        inventoryId: z.string().min(1),
      }),
      query: offsetPaginationSchema.optional(),
    }),
    output: detailedResponse(z.array(inventoryMovementSchema)),
  },

  getByVariantId: {
    input: z.object({
      params: z.object({
        variantId: z.string(),
      }),
    }),
    output: detailedResponse(inventorySelectSchema.nullable()),
  },

  getBySku: {
    input: z.object({
      params: z.object({
        sku: z.string(),
      }),
    }),
    output: detailedResponse(inventorySelectSchema.nullable()),
  },

  create: {
    input: z.object({
      data: inventoryInsertSchema,
    }),
    output: detailedResponse(inventorySelectSchema),
  },

  update: {
    input: z.object({
      params: z.object({
        id: z.string(),
      }),
      data: inventoryUpdateSchema,
    }),
    output: detailedResponse(inventorySelectSchema),
  },

  delete: {
    input: z.object({
      params: z.object({
        id: z.string(),
      }),
    }),
    output: detailedResponse(z.object({ deleted: z.boolean() })),
  },

  updateStock: {
    input: z.object({
      params: z.object({
        id: z.string(),
      }),
      data: z.object({
        quantity: z.number().int(),
        type: z.enum(["add", "subtract", "set"]),
        incoming: z.number().int().optional(),
      }),
    }),
    output: detailedResponse(inventorySelectSchema),
  },

  search: {
    input: z.object({
      query: searchSchema.merge(offsetPaginationSchema).optional(),
    }),
    output: detailedResponse(z.array(inventorySelectSchema)),
  },
};
