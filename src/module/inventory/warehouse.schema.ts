import { z } from "zod/v3";
import { detailedResponse, offsetPaginationSchema } from "@/shared/schema";

export const warehouseSchema = z.object({
  id: z.string().min(1),
  code: z.string().min(1),
  name: z.string().min(1),
  country: z.string().min(1),
  state: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  addressLine1: z.string().nullable().optional(),
  addressLine2: z.string().nullable().optional(),
  postalCode: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
});

export const warehouseInsertSchema = warehouseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const warehouseUpdateSchema = warehouseInsertSchema.partial();

export const warehouseListInputSchema = z.object({
  query: offsetPaginationSchema
    .extend({
      search: z.string().min(1).optional(),
      isActive: z.boolean().optional(),
    })
    .optional(),
});

export const warehouseListActiveInputSchema = z
  .object({
    query: z
      .object({
        search: z.string().min(1).optional(),
      })
      .optional(),
  })
  .optional();

export const warehouseContract = {
  list: {
    input: warehouseListInputSchema.optional(),
    output: detailedResponse(z.array(warehouseSchema)),
  },
  listActive: {
    input: warehouseListActiveInputSchema,
    output: detailedResponse(z.array(warehouseSchema)),
  },
  create: {
    input: z.object({ body: warehouseInsertSchema }),
    output: detailedResponse(warehouseSchema),
  },
  update: {
    input: z.object({
      params: z.object({ id: z.string().min(1) }),
      body: warehouseUpdateSchema,
    }),
    output: detailedResponse(warehouseSchema),
  },
  get: {
    input: z.object({
      params: z.object({ id: z.string().min(1) }),
    }),
    output: detailedResponse(warehouseSchema.nullable()),
  },
};
