import z from 'zod/v3'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { detailedResponse } from '@/module/category/dto/dto.category.contract'
import { subcategories } from '@/core/db/schema'

const subcategorySelectSchema = createSelectSchema(subcategories)
const subcategoryInsertSchema = createInsertSchema(subcategories)
const subcategoryUpdateSchema = createUpdateSchema(subcategories)

export const subcategoryContract = {
  get: {
    input: z.object({
      params: z.object({ id: z.string().optional(), slug: z.string().optional() }),
      query: z.object().optional(),
      body: z.object().optional(),
      headers: z.object().optional(),
    }),
    output: detailedResponse(subcategorySelectSchema.nullable()),
  },
  getMany: {
    input: z.object({
      params: z
        .object({
          categoryId: z.string().optional(),
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
    output: detailedResponse(z.array(subcategorySelectSchema)),
  },
  create: {
    input: z.object({
      params: z.object().optional(),
      query: z.object().optional(),
      body: subcategoryInsertSchema.omit({
        id: true,
        createdAt: true,
      }),
      headers: z.object().optional(),
    }),
    output: detailedResponse(subcategorySelectSchema.nullable()),
  },
  update: {
    input: z.object({
      params: z.object({
        id: z.string(),
      }),
      query: z.object().optional(),
      body: subcategoryUpdateSchema
        .omit({
          id: true,
          createdAt: true,
        })
        .partial(),
      headers: z.object().optional(),
    }),
    output: detailedResponse(subcategorySelectSchema.nullable()),
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
