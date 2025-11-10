import z from 'zod/v3'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { wishlist, wishlistItem } from './dto.wishlist.schema'

const wishlistSelectSchema = createSelectSchema(wishlist)
const wishlistInsertSchema = createInsertSchema(wishlist)
const wishlistItemSelectSchema = createSelectSchema(wishlistItem)
const wishlistItemInsertSchema = createInsertSchema(wishlistItem)

export const detailedResponse = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    status: z.enum(['success', 'error', 'failed']).default('success'),
    message: z.string(),
    data: dataSchema.nullable(),
    meta: z
      .object({
        timestamp: z.date().default(() => new Date()),
        version: z.string().default('1.0.0'),
      })
      .optional(),
  })

const wishlistWithItemsSchema = wishlistSelectSchema.extend({
  items: z.array(wishlistItemSelectSchema).optional(),
})

export const wishlistContract = {
  get: {
    input: z.object({
      params: z.object({ id: z.string() }),
      query: z.object().optional(),
      body: z.object().optional(),
      headers: z.object().optional(),
    }),
    output: detailedResponse(wishlistSelectSchema.nullable()),
  },
  getMany: {
    input: z.object({
      params: z.object().optional(),
      query: z.object().optional(),
      body: z.object({
        userId: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }),
      headers: z.object().optional(),
    }),
    output: detailedResponse(z.array(wishlistSelectSchema)),
  },
  getUserWishlist: {
    input: z.object({
      params: z.object({ userId: z.string() }),
      query: z.object().optional(),
      body: z.object().optional(),
      headers: z.object().optional(),
    }),
    output: detailedResponse(wishlistWithItemsSchema.nullable()),
  },
  create: {
    input: z.object({
      params: z.object().optional(),
      query: z.object().optional(),
      body: wishlistInsertSchema,
      headers: z.object().optional(),
    }),
    output: detailedResponse(wishlistSelectSchema),
  },
  addItem: {
    input: z.object({
      params: z.object().optional(),
      query: z.object().optional(),
      body: wishlistItemInsertSchema,
      headers: z.object().optional(),
    }),
    output: detailedResponse(wishlistItemSelectSchema),
  },
  removeItem: {
    input: z.object({
      params: z.object({ id: z.string() }),
      query: z.object().optional(),
      body: z.object().optional(),
      headers: z.object().optional(),
    }),
    output: detailedResponse(
      wishlistItemSelectSchema
        .pick({
          id: true,
        })
        .nullable(),
    ),
  },
  delete: {
    input: z.object({
      params: z.object({ id: z.string() }),
      query: z.object().optional(),
      body: z.object().optional(),
      headers: z.object().optional(),
    }),
    output: detailedResponse(
      wishlistSelectSchema
        .pick({
          id: true,
        })
        .nullable(),
    ),
  },
}
