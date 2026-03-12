import { z } from "zod/v3";
import { detailedResponse, paginationInput, shipmentStatusEnum as sharedShipmentStatusEnum } from "@/shared/schema";

export const shipmentStatusEnum = sharedShipmentStatusEnum;

export const shipmentBaseSchema = z.object({
  id: z.string().min(1),
  orderId: z.string().min(1),
  status: shipmentStatusEnum,
  trackingNumber: z.string().nullable().optional(),
  carrier: z.string().nullable().optional(),
  shippedAt: z.date().nullable().optional(),
  deliveredAt: z.date().nullable().optional(),
  estimatedDeliveryAt: z.date().nullable().optional(),
  shippingRate: z.number().int().nullable().optional(),
  weight: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date().nullable().optional(),
});

export const shipmentSelectSchema = shipmentBaseSchema;

export const shipmentCreateInputSchema = z.object({
  orderId: z.string().min(1),
  trackingNumber: z.string().optional(),
  carrier: z.string().optional(),
  notes: z.string().optional(),
  estimatedDeliveryAt: z.coerce.date().optional(),
  shippingRate: z.number().int().min(0).optional(),
  weight: z.string().optional(),
});

export const shipmentUpdateStatusInputSchema = z.object({
  status: shipmentStatusEnum,
  trackingNumber: z.string().optional(),
  carrier: z.string().optional(),
});

export const shipmentContract = {
  get: {
    input: z.object({
      params: z.object({ id: z.string().min(1) }),
    }),
    output: detailedResponse(shipmentSelectSchema),
  },
  getMany: {
    input: z
      .object({
        query: paginationInput
          .extend({
            status: shipmentStatusEnum.optional(),
            carrier: z.string().optional(),
          })
          .optional(),
      })
      .optional(),
    output: detailedResponse(z.array(shipmentSelectSchema)),
  },
  getByTracking: {
    input: z.object({
      params: z.object({ trackingNumber: z.string().min(1) }),
    }),
    output: detailedResponse(shipmentSelectSchema.nullable()),
  },
  create: {
    input: z.object({
      body: shipmentCreateInputSchema,
    }),
    output: detailedResponse(shipmentSelectSchema),
  },
  updateStatus: {
    input: z.object({
      params: z.object({ id: z.string().min(1) }),
      body: shipmentUpdateStatusInputSchema,
    }),
    output: detailedResponse(shipmentSelectSchema),
  },
  getByOrder: {
    input: z.object({
      params: z.object({ orderId: z.string().min(1) }),
    }),
    output: detailedResponse(z.array(shipmentSelectSchema)),
  },
};

export type Shipment = z.infer<typeof shipmentSelectSchema>;
export type ShipmentCreateInput = z.infer<typeof shipmentCreateInputSchema>;
export type ShipmentUpdateStatusInput = z.infer<typeof shipmentUpdateStatusInputSchema>;
