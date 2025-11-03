import z from 'zod'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { review } from './dto.review.schema'

const reviewSelectSchema = createSelectSchema(review)
const reviewInsertSchema = createInsertSchema(review)
const reviewUpdateSchema = createUpdateSchema(review)

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

export const reviewContract = {
  get: {
    input: z.object({
      params: z.object({ id: z.string() }),
      query: z.object().optional(),
      body: z.object().optional(),
      headers: z.object().optional(),
    }),
    output: detailedResponse(reviewSelectSchema.nullable()),
  },
  getMany: {
    input: z.object({
      params: z.object().optional(),
      query: z.object().optional(),
      body: z.object({
        productId: z.string().optional(),
        userId: z.string().optional(),
        rating: z.number().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }),
      headers: z.object().optional(),
    }),
    output: detailedResponse(z.array(reviewSelectSchema)),
  },
  getProductReviews: {
    input: z.object({
      params: z.object({ productId: z.string() }),
      query: z.object().optional(),
      body: z.object({
        rating: z.number().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }),
      headers: z.object().optional(),
    }),
    output: detailedResponse(z.array(reviewSelectSchema)),
  },
  getUserReviews: {
    input: z.object({
      params: z.object({ userId: z.string() }),
      query: z.object().optional(),
      body: z.object({
        limit: z.number().optional(),
        offset: z.number().optional(),
      }),
      headers: z.object().optional(),
    }),
    output: detailedResponse(z.array(reviewSelectSchema)),
  },
  create: {
    input: z.object({
      params: z.object().optional(),
      query: z.object().optional(),
      body: reviewInsertSchema,
      headers: z.object().optional(),
    }),
    output: detailedResponse(reviewSelectSchema),
  },
  update: {
    input: z.object({
      params: z.object({ id: z.string() }),
      query: z.object().optional(),
      body: reviewUpdateSchema,
      headers: z.object().optional(),
    }),
    output: detailedResponse(reviewSelectSchema),
  },
  delete: {
    input: z.object({
      params: z.object({ id: z.string() }),
      query: z.object().optional(),
      body: z.object().optional(),
      headers: z.object().optional(),
    }),
    output: detailedResponse(
      reviewSelectSchema
        .pick({
          id: true,
        })
        .nullable(),
    ),
  },
}
