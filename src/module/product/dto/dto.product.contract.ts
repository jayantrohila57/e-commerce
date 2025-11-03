import z from 'zod'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { product, productVariant, productImage } from './dto.product.schema'

const productSelectSchema = createSelectSchema(product)
const productInsertSchema = createInsertSchema(product)
const productUpdateSchema = createUpdateSchema(product)
const productVariantSelectSchema = createSelectSchema(productVariant)

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

const productWithDetailsSchema = productSelectSchema.extend({
  variants: z.array(productVariantSelectSchema).optional(),
  images: z.array(createSelectSchema(productImage)).optional(),
})

export const productContract = {
  get: {
    input: z.object({
      params: z.object({ id: z.string().optional(), slug: z.string().optional() }),
      query: z.object().optional(),
      body: z.object().optional(),
      headers: z.object().optional(),
    }),
    output: detailedResponse(productSelectSchema.nullable()),
  },
  getWithDetails: {
    input: z.object({
      params: z.object({ id: z.string().optional(), slug: z.string().optional() }),
      query: z.object().optional(),
      body: z.object().optional(),
      headers: z.object().optional(),
    }),
    output: detailedResponse(productWithDetailsSchema.nullable()),
  },
  getMany: {
    input: z.object({
      params: z.object().optional(),
      query: z.object().optional(),
      body: z.object({
        search: z.string().optional(),
        categoryId: z.string().optional(),
        brand: z.string().optional(),
        isActive: z.boolean().optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }),
      headers: z.object().optional(),
    }),
    output: detailedResponse(z.array(productSelectSchema)),
  },
  searchProducts: {
    input: z.object({
      params: z.object().optional(),
      query: z.object().optional(),
      body: z.object({
        query: z.string(),
        categoryId: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }),
      headers: z.object().optional(),
    }),
    output: detailedResponse(z.array(productSelectSchema)),
  },
  getProductsByCategory: {
    input: z.object({
      params: z.object({ categoryId: z.string() }),
      query: z.object().optional(),
      body: z.object({
        isActive: z.boolean().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }),
      headers: z.object().optional(),
    }),
    output: detailedResponse(z.array(productSelectSchema)),
  },
  create: {
    input: z.object({
      params: z.object().optional(),
      query: z.object().optional(),
      body: productInsertSchema,
      headers: z.object().optional(),
    }),
    output: detailedResponse(productSelectSchema),
  },
  update: {
    input: z.object({
      params: z.object({ id: z.string() }),
      query: z.object().optional(),
      body: productUpdateSchema,
      headers: z.object().optional(),
    }),
    output: detailedResponse(productSelectSchema),
  },
  delete: {
    input: z.object({
      params: z.object({ id: z.string() }),
      query: z.object().optional(),
      body: z.object().optional(),
      headers: z.object().optional(),
    }),
    output: detailedResponse(
      productSelectSchema
        .pick({
          id: true,
        })
        .nullable(),
    ),
  },
}
