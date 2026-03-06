import type z from "zod/v3";
import type {
  shipmentContract,
  shipmentCreateInputSchema,
  shipmentSelectSchema,
  shipmentUpdateStatusInputSchema,
} from "./shipment.schema";

export type Shipment = z.infer<typeof shipmentSelectSchema>;
export type ShipmentCreateInput = z.infer<typeof shipmentCreateInputSchema>;
export type ShipmentUpdateStatusInput = z.infer<typeof shipmentUpdateStatusInputSchema>;

export type GetShipmentInput = z.input<typeof shipmentContract.get.input>;
export type GetShipmentOutput = z.output<typeof shipmentContract.get.output>;

export type GetManyShipmentsInput = z.input<typeof shipmentContract.getMany.input>;
export type GetManyShipmentsOutput = z.output<typeof shipmentContract.getMany.output>;

export type GetByTrackingInput = z.input<typeof shipmentContract.getByTracking.input>;
export type GetByTrackingOutput = z.output<typeof shipmentContract.getByTracking.output>;
