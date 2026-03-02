import { inventoryBaseSchema } from "@/module/inventory/inventory.schema";
import z from "zod/v3";

// =========================
// ENUMS
// =========================
export const priceModifierTypeEnum = z.enum(["flat_increase", "flat_decrease", "percent_increase", "percent_decrease"]);

// =========================
// INVENTORY FOR VARIANT CREATION
// =========================
// When creating a variant with inventory, we don't include variantId (it's generated)
// or updatedAt (it's set automatically)
export const inventoryForVariantSchema = inventoryBaseSchema.omit({
  id: true,
  variantId: true,
  updatedAt: true,
});

// =========================
// BASE SCHEMA
// =========================
export const productVariantBaseSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  productId: z.string().min(1),

  title: z.string().min(1),

  priceModifierType: priceModifierTypeEnum.default("flat_decrease"),
  priceModifierValue: z.string().default("0"),

  attributes: z
    .array(
      z.object({
        title: z.string(),
        type: z.string(),
        value: z.string(),
      }),
    )
    .nullable()
    .default([]),

  media: z
    .array(
      z.object({
        url: z.string().url(),
      }),
    )
    .nullable()
    .default([]),

  createdAt: z.date().default(() => new Date()),
  updatedAt: z
    .date()
    .default(() => new Date())
    .nullable(),
  deletedAt: z.date().nullable().optional(),
});

// =========================
// SELECT / INSERT / UPDATE
// =========================
export const productVariantSelectSchema = productVariantBaseSchema;

export const productVariantInsertSchema = productVariantBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const productVariantUpdateSchema = productVariantBaseSchema.partial();

// =========================
// DETAILED RESPONSE WRAPPER
// =========================
export const detailedResponse = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    status: z.enum(["success", "error", "failed"]).default("success"),
    message: z.string(),
    data: dataSchema.nullable(),
    meta: z
      .object({
        timestamp: z.date().default(() => new Date()),
        version: z.string().default("1.0.0"),
        count: z.number().optional(),
      })
      .optional(),
  });

// =========================
// PAGINATION + SEARCH
// =========================
const paginationSchema = z.object({
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

// =========================
// COMBINED RESPONSE (variant + inventory)
// =========================
export const variantWithInventorySchema = productVariantSelectSchema.extend({
  inventory: z
    .object({
      id: z.string(),
      sku: z.string(),
      barcode: z.string().nullable().optional(),
      quantity: z.number().int(),
      incoming: z.number().int(),
      reserved: z.number().int(),
    })
    .nullable()
    .optional(),
});

// =========================
// CONTRACT
// =========================
export const productVariantContract = {
  create: {
    input: z.object({
      body: productVariantInsertSchema.extend({
        inventory: inventoryForVariantSchema,
      }),
    }),
    output: detailedResponse(variantWithInventorySchema),
  },

  get: {
    input: z.object({
      params: z.object({ id: z.string() }),
    }),
    output: detailedResponse(variantWithInventorySchema),
  },

  getMany: {
    input: z.object({
      query: paginationSchema.extend({
        productId: z.string().optional(),
      }),
    }),
    output: detailedResponse(z.array(variantWithInventorySchema)),
  },

  getBySlug: {
    input: z.object({
      params: z.object({ slug: z.string() }),
    }),
    output: detailedResponse(variantWithInventorySchema),
  },

  update: {
    input: z.object({
      params: z.object({ id: z.string() }),
      body: productVariantUpdateSchema,
    }),
    output: detailedResponse(productVariantSelectSchema),
  },

  delete: {
    input: z.object({
      params: z.object({ id: z.string() }),
    }),
    output: detailedResponse(productVariantSelectSchema.pick({ id: true }).nullable()),
  },
};
