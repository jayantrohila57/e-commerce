import z from 'zod'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { cart, cartItem } from './dto.cart.schema'

const cartSelectSchema = createSelectSchema(cart)
const cartInsertSchema = createInsertSchema(cart)
const cartUpdateSchema = createUpdateSchema(cart)
const cartItemSelectSchema = createSelectSchema(cartItem)
const cartItemInsertSchema = createInsertSchema(cartItem)

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

const cartWithItemsSchema = cartSelectSchema.extend({
  items: z.array(cartItemSelectSchema).optional(),
})

export const cartContract = {
  get: {
    input: z.object({
      params: z.object({ id: z.string() }),
      query: z.object().optional(),
      body: z.object().optional(),
      headers: z.object().optional(),
    }),
    output: detailedResponse(cartSelectSchema.nullable()),
  },
  getMany: {
    input: z.object({
      params: z.object().optional(),
      query: z.object().optional(),
      body: z.object({
        userId: z.string().optional(),
        status: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }),
      headers: z.object().optional(),
    }),
    output: detailedResponse(z.array(cartSelectSchema)),
  },
  getUserCart: {
    input: z.object({
      params: z.object({ userId: z.string() }),
      query: z.object().optional(),
      body: z.object().optional(),
      headers: z.object().optional(),
    }),
    output: detailedResponse(cartWithItemsSchema.nullable()),
  },
  create: {
    input: z.object({
      params: z.object().optional(),
      query: z.object().optional(),
      body: cartInsertSchema,
      headers: z.object().optional(),
    }),
    output: detailedResponse(cartSelectSchema),
  },
  addItem: {
    input: z.object({
      params: z.object().optional(),
      query: z.object().optional(),
      body: cartItemInsertSchema,
      headers: z.object().optional(),
    }),
    output: detailedResponse(cartItemSelectSchema),
  },
  updateItem: {
    input: z.object({
      params: z.object({ id: z.string() }),
      query: z.object().optional(),
      body: z.object({
        quantity: z.number().min(1),
      }),
      headers: z.object().optional(),
    }),
    output: detailedResponse(cartItemSelectSchema),
  },
  removeItem: {
    input: z.object({
      params: z.object({ id: z.string() }),
      query: z.object().optional(),
      body: z.object().optional(),
      headers: z.object().optional(),
    }),
    output: detailedResponse(
      cartItemSelectSchema
        .pick({
          id: true,
        })
        .nullable(),
    ),
  },
  clearCart: {
    input: z.object({
      params: z.object({ cartId: z.string() }),
      query: z.object().optional(),
      body: z.object().optional(),
      headers: z.object().optional(),
    }),
    output: detailedResponse(z.object({ cartId: z.string(), cleared: z.boolean() })),
  },
  update: {
    input: z.object({
      params: z.object({ id: z.string() }),
      query: z.object().optional(),
      body: cartUpdateSchema,
      headers: z.object().optional(),
    }),
    output: detailedResponse(cartSelectSchema),
  },
  delete: {
    input: z.object({
      params: z.object({ id: z.string() }),
      query: z.object().optional(),
      body: z.object().optional(),
      headers: z.object().optional(),
    }),
    output: detailedResponse(
      cartSelectSchema
        .pick({
          id: true,
        })
        .nullable(),
    ),
  },
}
