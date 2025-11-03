import z from 'zod'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { order, orderItem } from './dto.order.schema'

const orderSelectSchema = createSelectSchema(order)
const orderInsertSchema = createInsertSchema(order)
const orderUpdateSchema = createUpdateSchema(order)
const orderItemSelectSchema = createSelectSchema(orderItem)
const orderItemInsertSchema = createInsertSchema(orderItem)

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

const orderWithItemsSchema = orderSelectSchema.extend({
  items: z.array(orderItemSelectSchema).optional(),
})

export const orderContract = {
  get: {
    input: z.object({
      params: z.object({ id: z.string() }),
      query: z.object().optional(),
      body: z.object().optional(),
      headers: z.object().optional(),
    }),
    output: detailedResponse(orderSelectSchema.nullable()),
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
    output: detailedResponse(z.array(orderSelectSchema)),
  },
  getUserOrders: {
    input: z.object({
      params: z.object({ userId: z.string() }),
      query: z.object().optional(),
      body: z.object({
        status: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }),
      headers: z.object().optional(),
    }),
    output: detailedResponse(z.array(orderWithItemsSchema)),
  },
  getOrderWithItems: {
    input: z.object({
      params: z.object({ id: z.string() }),
      query: z.object().optional(),
      body: z.object().optional(),
      headers: z.object().optional(),
    }),
    output: detailedResponse(orderWithItemsSchema.nullable()),
  },
  create: {
    input: z.object({
      params: z.object().optional(),
      query: z.object().optional(),
      body: orderInsertSchema.extend({
        items: z.array(orderItemInsertSchema).optional(),
      }),
      headers: z.object().optional(),
    }),
    output: detailedResponse(orderWithItemsSchema),
  },
  update: {
    input: z.object({
      params: z.object({ id: z.string() }),
      query: z.object().optional(),
      body: orderUpdateSchema,
      headers: z.object().optional(),
    }),
    output: detailedResponse(orderSelectSchema),
  },
  cancelOrder: {
    input: z.object({
      params: z.object({ id: z.string() }),
      query: z.object().optional(),
      body: z.object().optional(),
      headers: z.object().optional(),
    }),
    output: detailedResponse(orderSelectSchema),
  },
  delete: {
    input: z.object({
      params: z.object({ id: z.string() }),
      query: z.object().optional(),
      body: z.object().optional(),
      headers: z.object().optional(),
    }),
    output: detailedResponse(
      orderSelectSchema
        .pick({
          id: true,
        })
        .nullable(),
    ),
  },
}
