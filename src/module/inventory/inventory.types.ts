import type z from 'zod/v3'
import {
    inventoryBaseSchema,
    inventoryInsertSchema,
    inventorySelectSchema,
    inventoryUpdateSchema,
    type inventoryContract,
} from './inventory.schema'

// =========================
// BASE TYPES
// =========================
export type InventoryBase = z.infer<typeof inventoryBaseSchema>
export type InventorySelect = z.infer<typeof inventorySelectSchema>
export type InventoryInsert = z.infer<typeof inventoryInsertSchema>
export type InventoryUpdate = z.infer<typeof inventoryUpdateSchema>

// =========================
// CONTRACT INPUT/OUTPUT TYPES
// =========================
export type GetInventoryInput = z.input<typeof inventoryContract.get.input>
export type GetInventoryOutput = z.output<typeof inventoryContract.get.output>

export type GetInventoriesInput = z.input<typeof inventoryContract.getMany.input>
export type GetInventoriesOutput = z.output<typeof inventoryContract.getMany.output>

export type GetByVariantIdInput = z.infer<typeof inventoryContract.getByVariantId.input>
export type GetByVariantIdOutput = z.infer<typeof inventoryContract.getByVariantId.output>

export type GetBySkuInput = z.infer<typeof inventoryContract.getBySku.input>
export type GetBySkuOutput = z.infer<typeof inventoryContract.getBySku.output>

export type CreateInventoryInput = z.input<typeof inventoryContract.create.input>
export type CreateInventoryOutput = z.output<typeof inventoryContract.create.output>

export type UpdateInventoryInput = z.input<typeof inventoryContract.update.input>
export type UpdateInventoryOutput = z.output<typeof inventoryContract.update.output>

export type DeleteInventoryInput = z.input<typeof inventoryContract.delete.input>
export type DeleteInventoryOutput = z.output<typeof inventoryContract.delete.output>

export type UpdateStockInput = z.input<typeof inventoryContract.updateStock.input>
export type UpdateStockOutput = z.output<typeof inventoryContract.updateStock.output>

export type SearchInventoryInput = z.input<typeof inventoryContract.search.input>
export type SearchInventoryOutput = z.output<typeof inventoryContract.search.output>
