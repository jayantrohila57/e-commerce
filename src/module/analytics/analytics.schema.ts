import z from "zod/v3";
import { detailedResponse, offsetPaginationSchema } from "@/shared/schema";

export const dateRangeSchemaBase = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export const dateRangeSchema = dateRangeSchemaBase.refine(
  (val) => {
    if (!val.from || !val.to) return true;
    return val.from <= val.to;
  },
  {
    message: "Invalid date range. `from` must be before or equal to `to`.",
  },
);

export const providerShippingSummaryItemSchema = z.object({
  providerId: z.string().nullable(),
  providerName: z.string().nullable(),
  methodId: z.string().nullable(),
  methodName: z.string().nullable(),
  ordersCount: z.number().int(),
  shipmentsCount: z.number().int(),
  shippingRevenue: z.number().int(),
});

export const inventoryStockSummaryItemSchema = z.object({
  variantId: z.string(),
  totalQuantity: z.number().int(),
  totalReserved: z.number().int(),
  totalIncoming: z.number().int(),
});

export const inventoryMovementSummaryItemSchema = z.object({
  inventoryId: z.string(),
  totalAdjustments: z.number().int(),
  totalIncrease: z.number().int(),
  totalDecrease: z.number().int(),
});

export const analyticsContract = {
  providerShippingSummary: {
    input: z
      .object({
        query: offsetPaginationSchema
          .and(
            z
              .object({
                from: z.coerce.date().optional(),
                to: z.coerce.date().optional(),
                providerId: z.string().optional(),
                methodId: z.string().optional(),
              })
              .refine(
                (val) => {
                  if (!val.from || !val.to) return true;
                  return val.from <= val.to;
                },
                {
                  message: "Invalid date range. `from` must be before or equal to `to`.",
                },
              ),
          )
          .optional(),
      })
      .optional(),
    output: detailedResponse(z.array(providerShippingSummaryItemSchema)),
  },

  inventoryStockSummary: {
    input: z.object({
      query: z
        .object({
          variantIds: z.array(z.string()).nonempty().optional(),
        })
        .and(offsetPaginationSchema)
        .optional(),
    }),
    output: detailedResponse(z.array(inventoryStockSummaryItemSchema)),
  },

  inventoryMovementSummary: {
    input: z.object({
      query: offsetPaginationSchema
        .and(
          z
            .object({
              from: z.coerce.date().optional(),
              to: z.coerce.date().optional(),
              inventoryIds: z.array(z.string()).nonempty().optional(),
            })
            .refine(
              (val) => {
                if (!val.from || !val.to) return true;
                return val.from <= val.to;
              },
              {
                message: "Invalid date range. `from` must be before or equal to `to`.",
              },
            ),
        )
        .optional(),
    }),
    output: detailedResponse(z.array(inventoryMovementSummaryItemSchema)),
  },
};

export type ProviderShippingSummaryItem = z.infer<typeof providerShippingSummaryItemSchema>;
export type InventoryStockSummaryItem = z.infer<typeof inventoryStockSummaryItemSchema>;
export type InventoryMovementSummaryItem = z.infer<typeof inventoryMovementSummaryItemSchema>;
