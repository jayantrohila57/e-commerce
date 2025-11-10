import z from 'zod/v3'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { payment } from './dto.payment.schema'

const paymentSelectSchema = createSelectSchema(payment)
const paymentInsertSchema = createInsertSchema(payment)
const paymentUpdateSchema = createUpdateSchema(payment)

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

export const paymentContract = {
  get: {
    input: z.object({
      params: z.object({ id: z.string() }),
      query: z.object().optional(),
      body: z.object().optional(),
      headers: z.object().optional(),
    }),
    output: detailedResponse(paymentSelectSchema.nullable()),
  },
  getMany: {
    input: z.object({
      params: z.object().optional(),
      query: z.object().optional(),
      body: z.object({
        orderId: z.string().optional(),
        provider: z.string().optional(),
        status: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }),
      headers: z.object().optional(),
    }),
    output: detailedResponse(z.array(paymentSelectSchema)),
  },
  create: {
    input: z.object({
      params: z.object().optional(),
      query: z.object().optional(),
      body: paymentInsertSchema,
      headers: z.object().optional(),
    }),
    output: detailedResponse(paymentSelectSchema),
  },
  update: {
    input: z.object({
      params: z.object({ id: z.string() }),
      query: z.object().optional(),
      body: paymentUpdateSchema,
      headers: z.object().optional(),
    }),
    output: detailedResponse(paymentSelectSchema),
  },
  delete: {
    input: z.object({
      params: z.object({ id: z.string() }),
      query: z.object().optional(),
      body: z.object().optional(),
      headers: z.object().optional(),
    }),
    output: detailedResponse(
      paymentSelectSchema
        .pick({
          id: true,
        })
        .nullable(),
    ),
  },
}
