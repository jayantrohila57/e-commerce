import z from "zod/v3";

export const detailedResponse = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    status: z.enum(["success", "error", "failed"]).default("success"),
    message: z.string(),
    data: dataSchema.nullable(),
    meta: z
      .object({
        timestamp: z.date().default(() => new Date()),
        version: z.string().default("1.0.0"),
        count: z.number().optional(),
      })
      .optional(),
  });

export const displayTypeEnum = z.enum(["grid", "carousel", "banner", "list", "featured"]);
export const visibilityEnum = z.enum(["public", "private", "hidden"]);

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

const paginationSchema = z.object({
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
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
      query: paginationSchema
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
