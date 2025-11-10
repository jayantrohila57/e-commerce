import { type categoryContract } from './dto.category.contract'
import type z from 'zod/v3'

export type GetCategoryInput = z.input<typeof categoryContract.get.input>
export type GetCategoryOutput = z.output<typeof categoryContract.get.output>

export type GetCategoriesInput = z.input<typeof categoryContract.getMany.input>
export type GetCategoriesOutput = z.output<typeof categoryContract.getMany.output>

export type CreateCategoryInput = z.input<typeof categoryContract.create.input>
export type CreateCategoryOutput = z.output<typeof categoryContract.create.output>

export type UpdateCategoryInput = z.input<typeof categoryContract.update.input>
export type UpdateCategoryOutput = z.output<typeof categoryContract.update.output>

export type DeleteCategoryInput = z.input<typeof categoryContract.delete.input>
export type DeleteCategoryOutput = z.output<typeof categoryContract.delete.output>

export type RestoreCategoryInput = z.input<typeof categoryContract.restore.input>
export type RestoreCategoryOutput = z.output<typeof categoryContract.restore.output>

export type ToggleVisibilityInput = z.input<typeof categoryContract.toggleVisibility.input>
export type ToggleVisibilityOutput = z.output<typeof categoryContract.toggleVisibility.output>

export type ToggleFeaturedInput = z.input<typeof categoryContract.toggleFeatured.input>
export type ToggleFeaturedOutput = z.output<typeof categoryContract.toggleFeatured.output>

export type ReorderCategoryInput = z.input<typeof categoryContract.reorder.input>
export type ReorderCategoryOutput = z.output<typeof categoryContract.reorder.output>

export type SearchCategoryInput = z.input<typeof categoryContract.search.input>
export type SearchCategoryOutput = z.output<typeof categoryContract.search.output>

export type GetControllerInput = { input: GetCategoryInput }
export type GetControllerOutput = Promise<GetCategoryOutput>

export type GetManyControllerInput = { input: GetCategoriesInput }
export type GetManyControllerOutput = Promise<GetCategoriesOutput>

export type CreateControllerInput = { input: CreateCategoryInput }
export type CreateControllerOutput = Promise<CreateCategoryOutput>

export type UpdateControllerInput = { input: UpdateCategoryInput }
export type UpdateControllerOutput = Promise<UpdateCategoryOutput>

export type DeleteControllerInput = { input: DeleteCategoryInput }
export type DeleteControllerOutput = Promise<DeleteCategoryOutput>

export type RestoreControllerInput = { input: RestoreCategoryInput }
export type RestoreControllerOutput = Promise<RestoreCategoryOutput>

export type ToggleVisibilityControllerInput = { input: ToggleVisibilityInput }
export type ToggleVisibilityControllerOutput = Promise<ToggleVisibilityOutput>

export type ToggleFeaturedControllerInput = { input: ToggleFeaturedInput }
export type ToggleFeaturedControllerOutput = Promise<ToggleFeaturedOutput>

export type ReorderControllerInput = { input: ReorderCategoryInput }
export type ReorderControllerOutput = Promise<ReorderCategoryOutput>

export type SearchControllerInput = { input: SearchCategoryInput }
export type SearchControllerOutput = Promise<SearchCategoryOutput>

export type GetServiceInput = { params: GetCategoryInput['params'] }
export type GetServiceOutput = Promise<GetCategoryOutput['data'] | null>

export type GetManyServiceInput = { query?: GetCategoriesInput['query'] }
export type GetManyServiceOutput = Promise<GetCategoriesOutput['data'] | null>

export type CreateServiceInput = { body: CreateCategoryInput['body'] }
export type CreateServiceOutput = Promise<CreateCategoryOutput['data'] | null>

export type UpdateServiceInput = {
  params: UpdateCategoryInput['params']
  body: UpdateCategoryInput['body']
}
export type UpdateServiceOutput = Promise<UpdateCategoryOutput['data'] | null>

export type DeleteServiceInput = { params: DeleteCategoryInput['params'] }
export type DeleteServiceOutput = Promise<DeleteCategoryOutput['data'] | null>

export type RestoreServiceInput = { params: RestoreCategoryInput['params'] }
export type RestoreServiceOutput = Promise<RestoreCategoryOutput['data'] | null>

export type ToggleVisibilityServiceInput = {
  params: ToggleVisibilityInput['params']
  body: ToggleVisibilityInput['body']
}
export type ToggleVisibilityServiceOutput = Promise<ToggleVisibilityOutput['data'] | null>

export type ToggleFeaturedServiceInput = {
  params: ToggleFeaturedInput['params']
  body: ToggleFeaturedInput['body']
}
export type ToggleFeaturedServiceOutput = Promise<ToggleFeaturedOutput['data'] | null>

export type ReorderServiceInput = { body: ReorderCategoryInput['body'] }
export type ReorderServiceOutput = Promise<ReorderCategoryOutput['data'] | null>

export type SearchServiceInput = { query: SearchCategoryInput['query'] }
export type SearchServiceOutput = Promise<SearchCategoryOutput['data'] | null>
