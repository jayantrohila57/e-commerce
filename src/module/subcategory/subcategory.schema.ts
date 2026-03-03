import { z } from "zod/v3";
import { detailedResponse, offsetPaginationSchema, visibilityEnum } from "@/shared/schema";
// Note: seriesSelectSchema import has been removed to avoid circular dependency

export const displayTypeEnum = z.enum(["grid", "carousel", "banner", "list", "featured"]);

export const subcategoryBaseSchema = z.object({
  id: z.string().min(1),
  categorySlug: z.string().min(1),
  slug: z.string().min(1),
  icon: z.string().nullable().optional(),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  metaTitle: z.string().nullable().optional(),
  metaDescription: z.string().nullable().optional(),
  displayType: displayTypeEnum.default("grid"),
  color: z.string().default("#FFFFFF").nullable(),
  visibility: visibilityEnum.default("public"),
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
});

// --- CRUD Variants ---
export const subcategorySelectSchema = subcategoryBaseSchema;

export const subcategoryInsertSchema = subcategoryBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const subcategoryUpdateSchema = subcategoryBaseSchema.partial();

// --- Pagination + Filters ---
const searchSchema = z.object({
  search: z.string().min(2).max(100).optional(),
  visibility: visibilityEnum.optional(),
  isFeatured: z.boolean().optional(),
  categorySlug: z.string().optional(),
});

// --- Contract ---
export const subcategoryContract = {
  getMany: {
    input: z.object({
      query: searchSchema.merge(offsetPaginationSchema).optional(),
    }),
    output: detailedResponse(z.array(subcategorySelectSchema)),
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
};

export type SubcategoryBase = z.infer<typeof subcategoryBaseSchema>;
export type SubcategorySelect = z.infer<typeof subcategorySelectSchema>;
export type SubcategoryInsert = z.infer<typeof subcategoryInsertSchema>;
export type SubcategoryUpdate = z.infer<typeof subcategoryUpdateSchema>;
