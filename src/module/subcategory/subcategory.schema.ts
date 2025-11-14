import { z } from 'zod/v3'
// Note: seriesSelectSchema import has been removed to avoid circular dependency

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

export const subcategoryBaseSchema = z.object({
  id: z.string().min(1),
  categorySlug: z.string().min(1),
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
  image: z.string().nullable().optional(),
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

// --- CRUD Variants ---
export const subcategorySelectSchema = subcategoryBaseSchema

export const subcategoryInsertSchema = subcategoryBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
})

export const subcategoryUpdateSchema = subcategoryBaseSchema.partial()

// --- Pagination + Filters ---
const paginationSchema = z.object({
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
})

const searchSchema = z.object({
  search: z.string().min(2).max(100).optional(),
  visibility: visibilityEnum.optional(),
  isFeatured: z.boolean().optional(),
  categorySlug: z.string().optional(),
})

// --- Contract ---
export const subcategoryContract = {
  get: {
    input: z.object({
      params: z.object({
        id: z.string().uuid().optional(),
        slug: z.string().optional(),
        categorySlug: z.string().optional(),
      }),
    }),
    output: detailedResponse(subcategorySelectSchema.nullable()),
  },

  getBySlug: {
    input: z.object({
      params: z.object({
        slug: z.string(),
        categorySlug: z.string(),
      }),
    }),
    output: detailedResponse(
      z
        .object({
          subcategoryData: subcategorySelectSchema,
          seriesData: z.array(z.any()), // Using z.any() to avoid circular dependency
        })
        .nullable(),
    ),
  },

  getMany: {
    input: z.object({
      query: searchSchema.merge(paginationSchema).optional(),
    }),
    output: detailedResponse(z.array(subcategorySelectSchema)),
  },

  create: {
    input: z.object({
      body: subcategoryInsertSchema,
    }),
    output: detailedResponse(subcategorySelectSchema),
  },

  update: {
    input: z.object({
      params: z.object({ id: z.string() }),
      body: subcategoryUpdateSchema,
    }),
    output: detailedResponse(subcategorySelectSchema),
  },

  delete: {
    input: z.object({
      params: z.object({ id: z.string() }),
    }),
    output: detailedResponse(subcategorySelectSchema.pick({ id: true }).nullable()),
  },

  search: {
    input: z.object({
      query: z.object({
        q: z.string().min(2),
        limit: z.number().max(50).default(10),
      }),
    }),
    output: detailedResponse(z.array(subcategorySelectSchema)),
  },
}

export type SubcategoryBase = z.infer<typeof subcategoryBaseSchema>
export type SubcategorySelect = z.infer<typeof subcategorySelectSchema>
export type SubcategoryInsert = z.infer<typeof subcategoryInsertSchema>
export type SubcategoryUpdate = z.infer<typeof subcategoryUpdateSchema>
