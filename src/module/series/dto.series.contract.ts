import z from 'zod/v3'
import { attributeSelectSchema } from '../attribute/dto.attribute.contract'

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

export const displayTypeEnum = z.enum(['grid', 'carousel', 'banner', 'list', 'featured'])
export const visibilityEnum = z.enum(['public', 'private', 'hidden'])

export const seriesBaseSchema = z.object({
  id: z.string().min(1),
  subcategorySlug: z.string().min(1),
  slug: z.string().min(1),
  icon: z.string().nullable().optional(),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  metaTitle: z.string().nullable().optional(),
  metaDescription: z.string().nullable().optional(),
  displayType: displayTypeEnum.default('grid'),
  color: z.string().default('#FFFFFF').nullable(),
  visibility: visibilityEnum.default('public'),
  displayOrder: z.number().int().default(0),
  image: z.string().nullable(),
  isFeatured: z.boolean().default(false),
  deletedAt: z.date().nullable().optional(),
  createdAt: z
    .date()
    .default(() => new Date())
    .nullable(),
  updatedAt: z
    .date()
    .default(() => new Date())
    .nullable(),
})

const paginationSchema = z.object({
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
})

const searchSchema = z.object({
  search: z.string().min(2).max(100).optional(),
  subcategorySlug: z.string().min(1).optional(),
})

export const seriesSelectSchema = seriesBaseSchema

export const seriesInsertSchema = seriesBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
})

export const seriesUpdateSchema = seriesBaseSchema.partial()

export const seriesContract = {
  get: {
    input: z.object({
      params: z.object({
        id: z.string(),
      }),
    }),
    output: detailedResponse(seriesSelectSchema.nullable()),
  },

  getBySlug: {
    input: z.object({
      params: z.object({
        slug: z.string(),
      }),
    }),
    output: detailedResponse(
      z.object({
        seriesData: seriesSelectSchema.nullable(),
        attributeData: z.array(attributeSelectSchema).nullable(),
      }),
    ),
  },

  getMany: {
    input: z.object({
      query: searchSchema.merge(paginationSchema).optional(),
    }),
    output: detailedResponse(z.array(seriesSelectSchema)),
  },

  getBySubcategory: {
    input: z.object({
      params: z.object({
        subcategorySlug: z.string().min(1),
      }),
      query: paginationSchema.optional(),
    }),
    output: detailedResponse(z.array(seriesSelectSchema)),
  },

  create: {
    input: z.object({
      body: seriesInsertSchema,
    }),
    output: detailedResponse(seriesSelectSchema),
  },

  update: {
    input: z.object({
      params: z.object({ id: z.string() }),
      body: seriesUpdateSchema,
    }),
    output: detailedResponse(seriesSelectSchema),
  },

  delete: {
    input: z.object({
      params: z.object({ id: z.string() }),
    }),
    output: detailedResponse(seriesSelectSchema.pick({ id: true }).nullable()),
  },

  restore: {
    input: z.object({
      params: z.object({ id: z.string() }),
    }),
    output: detailedResponse(seriesSelectSchema),
  },

  toggleVisibility: {
    input: z.object({
      params: z.object({ id: z.string() }),
      body: z.object({
        isActive: z.boolean().optional(),
        visibility: visibilityEnum.optional(),
      }),
    }),
    output: detailedResponse(seriesSelectSchema),
  },

  toggleFeatured: {
    input: z.object({
      params: z.object({ id: z.string() }),
      body: z.object({
        isFeatured: z.boolean(),
      }),
    }),
    output: detailedResponse(seriesSelectSchema),
  },

  reorder: {
    input: z.object({
      body: z.array(
        z.object({
          id: z.string(),
          displayOrder: z.number(),
        }),
      ),
    }),
    output: detailedResponse(z.array(seriesSelectSchema)),
  },

  search: {
    input: z.object({
      query: searchSchema.merge(paginationSchema),
    }),
    output: detailedResponse(z.array(seriesSelectSchema)),
  },
}

export type SeriesBase = z.infer<typeof seriesBaseSchema>
export type SeriesSelect = z.infer<typeof seriesSelectSchema>
export type SeriesInsert = z.infer<typeof seriesInsertSchema>
export type SeriesUpdate = z.infer<typeof seriesUpdateSchema>
