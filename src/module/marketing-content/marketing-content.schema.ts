import z from "zod/v3";
import { detailedResponse, offsetPaginationSchema } from "@/shared/schema";

export const marketingContentPageEnum = z.enum([
  "home",
  "store",
  "store_category",
  "store_subcategory",
  "product",
  "checkout",
  "about",
  "newsletter",
  "support",
]);

export const marketingContentSectionEnum = z.enum([
  "promo_banner",
  "cta",
  "offer_banner",
  "crousel",
  "split_banner",
  "announcement_bar",
  "feature_highlight",
]);

export const marketingContentItemSchema = z.object({
  title: z.string().nullable().optional(),
  bodyText: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  ctaLabel: z.string().nullable().optional(),
  ctaLink: z.string().nullable().optional(),
});

export const marketingContentBaseSchema = z.object({
  id: z.string().min(1),

  page: marketingContentPageEnum,
  section: marketingContentSectionEnum,

  title: z.string().nullable().optional(),
  bodyText: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  ctaLabel: z.string().nullable().optional(),
  ctaLink: z.string().nullable().optional(),
  productLink: z.string().nullable().optional(),

  items: z.array(marketingContentItemSchema).nullable().optional(),

  displayOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),

  startsAt: z.date().nullable().optional(),
  endsAt: z.date().nullable().optional(),

  createdAt: z.date().default(() => new Date()),
  updatedAt: z
    .date()
    .default(() => new Date())
    .nullable(),
});

export const marketingContentSelectSchema = marketingContentBaseSchema;

export const marketingContentInsertSchema = marketingContentBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const marketingContentUpdateSchema = marketingContentBaseSchema.partial();

const searchSchema = z.object({
  page: marketingContentPageEnum.optional(),
  section: marketingContentSectionEnum.optional(),
  isActive: z.boolean().optional(),
});

export const marketingContentContract = {
  get: {
    input: z.object({
      params: z.object({
        id: z.string().min(1),
      }),
    }),
    output: detailedResponse(marketingContentSelectSchema.nullable()),
  },
  getMany: {
    input: z.object({
      query: searchSchema.merge(offsetPaginationSchema).optional(),
    }),
    output: detailedResponse(z.array(marketingContentSelectSchema)),
  },
  create: {
    input: z.object({
      body: marketingContentInsertSchema,
    }),
    output: detailedResponse(marketingContentSelectSchema),
  },
  update: {
    input: z.object({
      params: z.object({
        id: z.string().min(1),
      }),
      body: marketingContentUpdateSchema,
    }),
    output: detailedResponse(marketingContentSelectSchema),
  },
  delete: {
    input: z.object({
      params: z.object({
        id: z.string().min(1),
      }),
    }),
    output: detailedResponse(
      marketingContentSelectSchema
        .pick({
          id: true,
        })
        .nullable(),
    ),
  },
};
