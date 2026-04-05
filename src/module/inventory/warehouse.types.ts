import type z from "zod/v3";
import type {
  warehouseContract,
  warehouseInsertSchema,
  warehouseSchema,
  warehouseUpdateSchema,
} from "./warehouse.schema";

export type Warehouse = z.infer<typeof warehouseSchema>;
export type WarehouseInsert = z.infer<typeof warehouseInsertSchema>;
export type WarehouseUpdate = z.infer<typeof warehouseUpdateSchema>;

export type ListWarehousesInput = z.input<typeof warehouseContract.list.input>;
export type ListWarehousesOutput = z.output<typeof warehouseContract.list.output>;

export type ListActiveWarehousesInput = z.input<typeof warehouseContract.listActive.input>;
export type ListActiveWarehousesOutput = z.output<typeof warehouseContract.listActive.output>;

export type CreateWarehouseInput = z.input<typeof warehouseContract.create.input>;
export type CreateWarehouseOutput = z.output<typeof warehouseContract.create.output>;

export type UpdateWarehouseInput = z.input<typeof warehouseContract.update.input>;
export type UpdateWarehouseOutput = z.output<typeof warehouseContract.update.output>;

export type GetWarehouseInput = z.input<typeof warehouseContract.get.input>;
export type GetWarehouseOutput = z.output<typeof warehouseContract.get.output>;
