import { z } from "zod/v3";
import { productVariantBaseSchema } from "@/module/product-variant/product-variant.schema";
import { detailedResponse, offsetPaginationSchema, visibilityEnum } from "@/shared/schema";

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
          variants: z.array(
            z.object({
              // Variant data
              id: z.string(),
              slug: z.string(),
              title: z.string(),
              priceModifierType: z.string(),
              priceModifierValue: z.string(),
              attributes: z
                .array(
                  z.object({
                    title: z.string(),
                    type: z.string(),
                    value: z.string(),
                  }),
                )
                .nullable(),
              media: z
                .array(
                  z.object({
                    url: z.string(),
                  }),
                )
                .nullable(),
              // Product base data
              productId: z.string(),
              productTitle: z.string(),
              productSlug: z.string(),
              productDescription: z.string().nullable(),
              productBasePrice: z.number(),
              productBaseImage: z.string().nullable(),
              // Computed
              finalPrice: z.number(),
            }),
          ),
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

  getAvailable: {
    input: z.object({
      query: z.object({
        excludeCategorySlug: z.string(),
        search: z.string().min(2).max(100).optional(),
      }),
    }),
    output: detailedResponse(z.array(subcategorySelectSchema)),
  },

  transfer: {
    input: z.object({
      params: z.object({ id: z.string() }),
      body: z.object({
        categorySlug: z.string().min(1),
      }),
    }),
    output: detailedResponse(subcategorySelectSchema),
  },
};

export type SubcategoryBase = z.infer<typeof subcategoryBaseSchema>;
export type SubcategorySelect = z.infer<typeof subcategorySelectSchema>;
export type SubcategoryInsert = z.infer<typeof subcategoryInsertSchema>;
export type SubcategoryUpdate = z.infer<typeof subcategoryUpdateSchema>;
