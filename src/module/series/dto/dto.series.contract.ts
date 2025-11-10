import z from 'zod/v3'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { series } from '@/core/db/schema'

const seriesSelectSchema = createSelectSchema(series)
const seriesInsertSchema = createInsertSchema(series)
const seriesUpdateSchema = createUpdateSchema(series)

import { detailedResponse } from '@/module/category/dto/dto.category.contract'

export const seriesContract = {
  get: {
    input: z.object({
      params: z.object({ id: z.string().optional(), slug: z.string().optional() }),
      query: z.object().optional(),
      body: z.object().optional(),
      headers: z.object().optional(),
    }),
    output: detailedResponse(seriesSelectSchema.nullable()),
  },
  getMany: {
    input: z.object({
      params: z
        .object({
          subcategoryId: z.string().optional(),
        })
        .optional(),
      query: z.object().optional(),
      body: z.object({
        search: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }),
      headers: z.object().optional(),
    }),
    output: detailedResponse(z.array(seriesSelectSchema)),
  },
  create: {
    input: z.object({
      params: z.object().optional(),
      query: z.object().optional(),
      body: seriesInsertSchema.omit({
        id: true,
        createdAt: true,
      }),
      headers: z.object().optional(),
    }),
    output: detailedResponse(seriesSelectSchema.nullable()),
  },
  update: {
    input: z.object({
      params: z.object({
        id: z.string(),
      }),
      query: z.object().optional(),
      body: seriesUpdateSchema
        .omit({
          id: true,
          createdAt: true,
        })
        .partial(),
      headers: z.object().optional(),
    }),
    output: detailedResponse(seriesSelectSchema.nullable()),
  },
  delete: {
    input: z.object({
      params: z.object({
        id: z.string(),
      }),
      query: z.object().optional(),
      body: z.object().optional(),
      headers: z.object().optional(),
    }),
    output: detailedResponse(z.object({ id: z.string() })),
  },
}
