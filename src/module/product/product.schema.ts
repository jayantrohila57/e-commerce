import z from 'zod/v3'
import { productVariantBaseSchema } from '../product-variant/product-variant.schema'

export const detailedResponse = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    status: z.enum(['success', 'error', 'failed']).default('success'),
    message: z.string(),
    data: dataSchema.nullable(),
    meta: z
      .object({
        timestamp: z.date().default(() => new Date()),
        version: z.string().default('1.0.0'),
        count: z.number().optional(),
      })
      .optional(),
  })

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

  // PRICING
  basePrice: z.number().min(0),
  baseCurrency: z.string().default('INR').nullable(),
  baseImage: z.string().nullable().optional(),

  // FEATURES
  features: z
    .array(z.object({ title: z.string() }))
    .nullable()
    .optional(),

  // STATE
  isActive: z.boolean().default(true).nullable(),
  status: z.enum(['draft', 'archive', 'live']).default('draft'),

  // SYSTEM
  deletedAt: z.date().nullable().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z
    .date()
    .default(() => new Date())
    .nullable(),
})

export const productSelectSchema = baseProductSchema

export const productInsertSchema = baseProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
})

export const productUpdateSchema = baseProductSchema.partial()

//
// SEARCH + PAGINATION
//
const paginationSchema = z.object({
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
})

const searchSchema = z.object({
  search: z.string().min(2).max(100).optional(),
  visibility: z.enum(['public', 'private', 'hidden']).optional(),
  isFeatured: z.boolean().optional(),
})

export const productContract = {
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
      query: z.object({
        q: z.string().min(2),
        limit: z.number().max(50).default(10),
      }),
    }),
    output: detailedResponse(z.array(productSelectSchema)),
  },
}
