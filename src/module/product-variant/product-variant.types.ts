import type z from 'zod/v3'
import {
  type productVariantContract,
  type priceModifierTypeEnum,
  type productVariantBaseSchema,
  type productVariantInsertSchema,
  type productVariantSelectSchema,
  type productVariantUpdateSchema,
} from './product-variant.schema'

export type ProductVariantBase = z.infer<typeof productVariantBaseSchema>
export type ProductVariantSelect = z.infer<typeof productVariantSelectSchema>
export type ProductVariantInsert = z.infer<typeof productVariantInsertSchema>
export type ProductVariantUpdate = z.infer<typeof productVariantUpdateSchema>
export type PriceModifierType = z.infer<typeof priceModifierTypeEnum>

export type GetProductVariantInput = z.input<typeof productVariantContract.get.input>
export type GetProductVariantOutput = z.output<typeof productVariantContract.get.output>

export type GetProductVariantsInput = z.input<typeof productVariantContract.getMany.input>
export type GetProductVariantsOutput = z.output<typeof productVariantContract.getMany.output>

export type GetProductVariantBySlugInput = z.infer<typeof productVariantContract.getBySlug.input>
export type GetProductVariantBySlugOutput = z.infer<typeof productVariantContract.getBySlug.output>

export type CreateProductVariantInput = z.input<typeof productVariantContract.create.input>
export type CreateProductVariantOutput = z.output<typeof productVariantContract.create.output>

export type UpdateProductVariantInput = z.input<typeof productVariantContract.update.input>
export type UpdateProductVariantOutput = z.output<typeof productVariantContract.update.output>

export type DeleteProductVariantInput = z.input<typeof productVariantContract.delete.input>
export type DeleteProductVariantOutput = z.output<typeof productVariantContract.delete.output>
