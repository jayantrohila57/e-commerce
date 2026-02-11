import { productVariantBaseSchema } from '@/module/product-variant/product-variant.schema'
import { productSelectSchema } from '@/module/product/product.schema'
import z from 'zod/v3'

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

const wishlistItemSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  variantId: z.string().min(1),
})

export const wishlistSelectSchema = wishlistItemSchema.extend({
  variant: productVariantBaseSchema
    .extend({
      product: productSelectSchema.optional(),
    })
    .optional(),
})

export const wishlistCreateSchema = z.object({
  body: z.object({
    variantId: z.string().min(1),
  }),
})

export const wishlistDeleteSchema = z.object({
  params: z.object({ id: z.string().optional(), variantId: z.string().optional() }),
})

const paginationSchema = z.object({
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
})

export const wishlistContract = {
  getUserWishlist: {
    input: z.object({ query: paginationSchema.optional() }),
    output: detailedResponse(z.array(wishlistSelectSchema)),
  },
  addItem: {
    input: wishlistCreateSchema,
    output: detailedResponse(wishlistSelectSchema),
  },
  removeItem: {
    input: wishlistDeleteSchema,
    output: detailedResponse(wishlistSelectSchema.nullable()),
  },
  clear: {
    input: z.object({}),
    output: detailedResponse(z.object({ clearedCount: z.number() })),
  },
}

export type WishlistSelectSchema = z.infer<typeof wishlistSelectSchema>
