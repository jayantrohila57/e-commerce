import z from "zod/v3";
import { detailedResponse, offsetPaginationSchema } from "@/shared/schema";
import { productVariantBaseSchema } from "../product-variant/product-variant.schema";

export const baseProductSchema = z.object({
  id: z.string().min(1),

  title: z.string().min(1),
  description: z.string().nullable().optional(),
  metaTitle: z.string().nullable().optional(),
  metaDescription: z.string().nullable().optional(),
  slug: z.string().min(1),

  // RELATIONS
  categorySlug: z.string().min(1),
  subcategorySlug: z.string().min(1),
  seriesSlug: z.string().min(1),

  // PRICING (currency field stores string; coerce for API/DB)
  basePrice: z.coerce.number().min(0),
  baseCurrency: z.string().default("INR").nullable(),
  baseImage: z.string().nullable().optional(),

  // FEATURES
  features: z
    .array(z.object({ title: z.string() }))
    .nullable()
    .optional(),

  // STATE
  isActive: z.boolean().default(true).nullable(),
  status: z.enum(["draft", "archive", "live"]).default("draft"),

  // SYSTEM
  deletedAt: z.date().nullable().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z
    .date()
    .default(() => new Date())
    .nullable(),
});

export const productSelectSchema = baseProductSchema;

export const productInsertSchema = baseProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const productUpdateSchema = baseProductSchema.partial();

//
// SEARCH + PAGINATION
//
const searchSchema = z.object({
  search: z.string().min(2).max(100).optional(),
  visibility: z.enum(["public", "private", "hidden"]).optional(),
  isFeatured: z.boolean().optional(),
});

export const productContract = {
  get: {
    input: z.object({
      params: z.object({
        id: z.string().optional(),
        slug: z.string().optional(),
      }),
    }),
    output: detailedResponse(productSelectSchema.nullable()),
  },
  getBySlug: {
    input: z.object({
      params: z.object({
        slug: z.string().min(1),
      }),
    }),
    output: detailedResponse(
      z
        .object({
          product: productSelectSchema,
        })
        .nullable(),
    ),
  },
  getMany: {
    input: z.object({
      query: offsetPaginationSchema.extend({
        categorySlug: z.string().optional(),
        seriesSlug: z.string().optional(),
        isActive: z.boolean().optional(),
      }),
    }),
    output: detailedResponse(z.array(productSelectSchema)),
  },
  getPDPProduct: {
    input: z.object({
      params: z.object({
        slug: z.string().min(1),
      }),
    }),
    output: detailedResponse(
      z
        .object({
          product: productSelectSchema.extend({
            variants: z.array(productVariantBaseSchema),
          }),
        })
        .nullable(),
    ),
  },
  getProductsBySeriesSlug: {
    input: z.object({
      params: z.object({
        slug: z.string().min(1),
      }),
    }),
    output: detailedResponse(
      z.array(
        productSelectSchema.extend({
          variant: productVariantBaseSchema,
        }),
      ),
    ),
  },
  getProductWithProductVariants: {
    input: z.object({
      params: z.object({
        slug: z.string().min(1),
      }),
    }),
    output: detailedResponse(
      z.object({
        product: productSelectSchema.extend({
          variants: z.array(
            productVariantBaseSchema.pick({
              id: true,
              slug: true,
              title: true,
              productId: true,
              priceModifierType: true,
              priceModifierValue: true,
              attributes: true,
              media: true,
              createdAt: true,
              updatedAt: true,
              deletedAt: true,
            }),
          ),
        }),
      }),
    ),
  },

  create: {
    input: z.object({
      body: productInsertSchema,
    }),
    output: detailedResponse(productSelectSchema),
  },

  update: {
    input: z.object({
      params: z.object({ id: z.string() }),
      body: productUpdateSchema,
    }),
    output: detailedResponse(productSelectSchema),
  },

  delete: {
    input: z.object({
      params: z.object({ id: z.string() }),
    }),
    output: detailedResponse(productSelectSchema.pick({ id: true }).nullable()),
  },

  search: {
    input: z.object({
      query: offsetPaginationSchema.extend({
        q: z.string().min(2),
      }),
    }),
    output: detailedResponse(z.array(productSelectSchema)),
  },
};
