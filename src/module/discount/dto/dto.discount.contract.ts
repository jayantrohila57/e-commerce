import z from 'zod'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { discount } from './dto.discount.schema'

const discountSelectSchema = createSelectSchema(discount)
const discountInsertSchema = createInsertSchema(discount)
const discountUpdateSchema = createUpdateSchema(discount)

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

export const discountContract = {
  get: {
    input: z.object({
      params: z.object({ id: z.string().optional(), code: z.string().optional() }),
      query: z.object().optional(),
      body: z.object().optional(),
      headers: z.object().optional(),
    }),
    output: detailedResponse(discountSelectSchema.nullable()),
  },
  getMany: {
    input: z.object({
      params: z.object().optional(),
      query: z.object().optional(),
      body: z.object({
        isActive: z.boolean().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }),
      headers: z.object().optional(),
    }),
    output: detailedResponse(z.array(discountSelectSchema)),
  },
  validateCode: {
    input: z.object({
      params: z.object({ code: z.string() }),
      query: z.object().optional(),
      body: z.object().optional(),
      headers: z.object().optional(),
    }),
    output: detailedResponse(discountSelectSchema.nullable()),
  },
  create: {
    input: z.object({
      params: z.object().optional(),
      query: z.object().optional(),
      body: discountInsertSchema,
      headers: z.object().optional(),
    }),
    output: detailedResponse(discountSelectSchema),
  },
  update: {
    input: z.object({
      params: z.object({ id: z.string() }),
      query: z.object().optional(),
      body: discountUpdateSchema,
      headers: z.object().optional(),
    }),
    output: detailedResponse(discountSelectSchema),
  },
  delete: {
    input: z.object({
      params: z.object({ id: z.string() }),
      query: z.object().optional(),
      body: z.object().optional(),
      headers: z.object().optional(),
    }),
    output: detailedResponse(
      discountSelectSchema
        .pick({
          id: true,
        })
        .nullable(),
    ),
  },
}
