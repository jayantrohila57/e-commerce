import z from "zod/v3";

export const inventoryBaseSchema = z.object({
  id: z.string().min(1),
  variantId: z.string().min(1),
  sku: z.string().min(1),
  barcode: z.string().nullable().optional(),
  quantity: z.number().int(),
  incoming: z.number().int(),
  reserved: z.number().int(),
  updatedAt: z
    .date()
    .default(() => new Date())
    .nullable(),
});

export const inventorySelectSchema = inventoryBaseSchema;

export const inventoryInsertSchema = inventoryBaseSchema.omit({
  id: true,
  updatedAt: true,
});

export const inventoryUpdateSchema = inventoryBaseSchema.partial();

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

const paginationSchema = z.object({
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

const searchSchema = z.object({
  search: z.string().min(2).max(100).optional(),
});

export const inventoryContract = {
  get: {
    input: z.object({
      params: z.object({
        id: z.string().optional(),
        sku: z.string().optional(),
      }),
    }),
    output: detailedResponse(inventorySelectSchema.nullable()),
  },

  getMany: {
    input: z.object({
      query: searchSchema.merge(paginationSchema).optional(),
    }),
    output: detailedResponse(z.array(inventorySelectSchema)),
  },

  getByVariantId: {
    input: z.object({
      params: z.object({
        variantId: z.string(),
      }),
    }),
    output: detailedResponse(inventorySelectSchema.nullable()),
  },

  getBySku: {
    input: z.object({
      params: z.object({
        sku: z.string(),
      }),
    }),
    output: detailedResponse(inventorySelectSchema.nullable()),
  },

  create: {
    input: z.object({
      data: inventoryInsertSchema,
    }),
    output: detailedResponse(inventorySelectSchema),
  },

  update: {
    input: z.object({
      params: z.object({
        id: z.string(),
      }),
      data: inventoryUpdateSchema,
    }),
    output: detailedResponse(inventorySelectSchema),
  },

  delete: {
    input: z.object({
      params: z.object({
        id: z.string(),
      }),
    }),
    output: detailedResponse(z.object({ deleted: z.boolean() })),
  },

  updateStock: {
    input: z.object({
      params: z.object({
        id: z.string(),
      }),
      data: z.object({
        quantity: z.number().int(),
        type: z.enum(["add", "subtract", "set"]),
        incoming: z.number().int().optional(),
      }),
    }),
    output: detailedResponse(inventorySelectSchema),
  },

  search: {
    input: z.object({
      query: searchSchema.merge(paginationSchema).optional(),
    }),
    output: detailedResponse(z.array(inventorySelectSchema)),
  },
};
