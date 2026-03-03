import z from "zod/v3";
import { detailedResponse, offsetPaginationSchema } from "@/shared/schema";

export const attributeBaseSchema = z.object({
  id: z.string().min(1),
  seriesSlug: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  type: z.string().default("text"),
  value: z.string().min(1),
  displayOrder: z.number().int().default(0),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
});

export const attributeSelectSchema = attributeBaseSchema;

export const attributeInsertSchema = attributeBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const attributeUpdateSchema = attributeInsertSchema.partial();

// Search
const searchSchema = z.object({
  search: z.string().min(2).max(100).optional(),
  seriesSlug: z.string().min(1).optional(),
});

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
      query: searchSchema.merge(offsetPaginationSchema).optional(),
    }),
    output: detailedResponse(z.array(attributeSelectSchema)),
  },

  getBySeries: {
    input: z.object({
      params: z.object({
        seriesSlug: z.string(),
      }),
      query: offsetPaginationSchema.optional(),
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
      query: searchSchema.merge(offsetPaginationSchema),
    }),
    output: detailedResponse(z.array(attributeSelectSchema)),
  },
};

export type AttributeBase = z.infer<typeof attributeBaseSchema>;
export type AttributeSelect = z.infer<typeof attributeSelectSchema>;
export type AttributeInsert = z.infer<typeof attributeInsertSchema>;
export type AttributeUpdate = z.infer<typeof attributeUpdateSchema>;
