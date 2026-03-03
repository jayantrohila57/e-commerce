import z from "zod/v3";
import { detailedResponse, offsetPaginationSchema, visibilityEnum } from "@/shared/schema";

export const displayTypeEnum = z.enum(["grid", "carousel", "banner", "list", "featured"]);

export const seriesBaseSchema = z.object({
  id: z.string().min(1),
  subcategorySlug: z.string().min(1),
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
});

export const seriesSelectSchema = seriesBaseSchema;

export const seriesInsertSchema = seriesBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const seriesUpdateSchema = seriesBaseSchema.partial();

export const seriesContract = {
  getMany: {
    input: z.object({
      query: offsetPaginationSchema
        .extend({
          subcategorySlug: z.string().optional(),
        })
        .optional(),
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
};
