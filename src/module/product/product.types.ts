import {
  type productContract,
  baseProductSchema,
  productInsertSchema,
  productSelectSchema,
  productUpdateSchema,
} from './product.schema'
import type z from 'zod/v3'

export type ProductBase = z.infer<typeof baseProductSchema>
export type ProductSelect = z.infer<typeof productSelectSchema>
export type ProductInsert = z.infer<typeof productInsertSchema>
export type ProductUpdate = z.infer<typeof productUpdateSchema>

export type GetProductInput = z.input<typeof productContract.get.input>
export type GetProductOutput = z.output<typeof productContract.get.output>

export type GetCategoriesInput = z.input<typeof productContract.getMany.input>
export type GetCategoriesOutput = z.output<typeof productContract.getMany.output>

export type GetProductWithSubcategoriesInput = z.infer<typeof productContract.getBySlug.input>
export type GetProductWithSubcategoriesOutput = z.infer<typeof productContract.getBySlug.output>

export type CreateProductInput = z.input<typeof productContract.create.input>
export type CreateProductOutput = z.output<typeof productContract.create.output>

export type UpdateProductInput = z.input<typeof productContract.update.input>
export type UpdateProductOutput = z.output<typeof productContract.update.output>

export type DeleteProductInput = z.input<typeof productContract.delete.input>
export type DeleteProductOutput = z.output<typeof productContract.delete.output>

export type SearchProductInput = z.input<typeof productContract.search.input>
export type SearchProductOutput = z.output<typeof productContract.search.output>
