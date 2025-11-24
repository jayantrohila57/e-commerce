import z from 'zod/v3'

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

export const attributeBaseSchema = z.object({
  id: z.string().min(1),
  seriesSlug: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  type: z.string().default('text'),
  value: z.string().min(1),
  displayOrder: z.number().int().default(0),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
})

export const attributeSelectSchema = attributeBaseSchema

export const attributeInsertSchema = attributeBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
})

export const attributeUpdateSchema = attributeInsertSchema.partial()
const paginationSchema = z.object({
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
})

// Search
const searchSchema = z.object({
  search: z.string().min(2).max(100).optional(),
  seriesSlug: z.string().min(1).optional(),
})

export const attributeContract = {
  get: {
    input: z.object({
      params: z.object({
        id: z.string(),
      }),
    }),
    output: detailedResponse(attributeSelectSchema.nullable()),
  },

  getBySlug: {
    input: z.object({
      params: z.object({
        slug: z.string(),
      }),
    }),
    output: detailedResponse(attributeSelectSchema.nullable()),
  },

  getMany: {
    input: z.object({
      query: searchSchema.merge(paginationSchema).optional(),
    }),
    output: detailedResponse(z.array(attributeSelectSchema)),
  },

  getBySeries: {
    input: z.object({
      params: z.object({
        seriesSlug: z.string(),
      }),
      query: paginationSchema.optional(),
    }),
    output: detailedResponse(z.array(attributeSelectSchema)),
  },

  create: {
    input: z.object({
      body: attributeInsertSchema,
    }),
    output: detailedResponse(attributeSelectSchema),
  },

  update: {
    input: z.object({
      params: z.object({
        id: z.string(),
      }),
      body: attributeUpdateSchema,
    }),
    output: detailedResponse(attributeSelectSchema),
  },

  delete: {
    input: z.object({
      params: z.object({
        id: z.string(),
      }),
    }),
    output: detailedResponse(z.null()),
  },

  search: {
    input: z.object({
      query: searchSchema.merge(paginationSchema),
    }),
    output: detailedResponse(z.array(attributeSelectSchema)),
  },
}

export type AttributeBase = z.infer<typeof attributeBaseSchema>
export type AttributeSelect = z.infer<typeof attributeSelectSchema>
export type AttributeInsert = z.infer<typeof attributeInsertSchema>
export type AttributeUpdate = z.infer<typeof attributeUpdateSchema>
