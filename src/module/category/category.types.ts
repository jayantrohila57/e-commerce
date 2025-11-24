import {
  categoryBaseSchema,
  categoryInsertSchema,
  categorySelectSchema,
  categoryUpdateSchema,
  type categoryContract,
} from './category.schema'

import type z from 'zod/v3'

export type CategoryBase = z.infer<typeof categoryBaseSchema>
export type CategorySelect = z.infer<typeof categorySelectSchema>
export type CategoryInsert = z.infer<typeof categoryInsertSchema>
export type CategoryUpdate = z.infer<typeof categoryUpdateSchema>

export type GetCategoryInput = z.input<typeof categoryContract.get.input>
export type GetCategoryOutput = z.output<typeof categoryContract.get.output>

export type GetCategoriesInput = z.input<typeof categoryContract.getMany.input>
export type GetCategoriesOutput = z.output<typeof categoryContract.getMany.output>

export type GetManyByTypesInput = z.input<typeof categoryContract.getManyByTypes.input>
export type GetManyByTypesOutput = z.output<typeof categoryContract.getManyByTypes.output>

export type GetCategoryWithSubcategoriesInput = z.infer<typeof categoryContract.getCategoryWithSubCategories.input>
export type GetCategoryWithSubcategoriesOutput = z.infer<typeof categoryContract.getCategoryWithSubCategories.output>

export type CreateCategoryInput = z.input<typeof categoryContract.create.input>
export type CreateCategoryOutput = z.output<typeof categoryContract.create.output>

export type UpdateCategoryInput = z.input<typeof categoryContract.update.input>
export type UpdateCategoryOutput = z.output<typeof categoryContract.update.output>

export type DeleteCategoryInput = z.input<typeof categoryContract.delete.input>
export type DeleteCategoryOutput = z.output<typeof categoryContract.delete.output>
