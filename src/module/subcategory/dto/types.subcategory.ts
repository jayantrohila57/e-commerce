import { type subcategoryContract } from './dto.subcategory.contract'
import type z from 'zod/v3'

export type GetSubcategoryInput = z.infer<typeof subcategoryContract.get.input>
export type GetSubcategoryOutput = z.infer<typeof subcategoryContract.get.output>

export type GetSubcategoryBySlugInput = z.infer<typeof subcategoryContract.getBySlug.input>
export type GetSubcategoryBySlugOutput = z.infer<typeof subcategoryContract.getBySlug.output>

export type GetSubcategoriesInput = z.infer<typeof subcategoryContract.getMany.input>
export type GetSubcategoriesOutput = z.infer<typeof subcategoryContract.getMany.output>

export type CreateSubcategoryInput = z.infer<typeof subcategoryContract.create.input>
export type CreateSubcategoryOutput = z.infer<typeof subcategoryContract.create.output>

export type UpdateSubcategoryInput = z.infer<typeof subcategoryContract.update.input>
export type UpdateSubcategoryOutput = z.infer<typeof subcategoryContract.update.output>

export type DeleteSubcategoryInput = z.infer<typeof subcategoryContract.delete.input>
export type DeleteSubcategoryOutput = z.infer<typeof subcategoryContract.delete.output>

export type RestoreSubcategoryInput = z.infer<typeof subcategoryContract.restore.input>
export type RestoreSubcategoryOutput = z.infer<typeof subcategoryContract.restore.output>

export type ToggleVisibilitySubcategoryInput = z.infer<typeof subcategoryContract.toggleVisibility.input>
export type ToggleVisibilitySubcategoryOutput = z.infer<typeof subcategoryContract.toggleVisibility.output>

export type ToggleFeaturedSubcategoryInput = z.infer<typeof subcategoryContract.toggleFeatured.input>
export type ToggleFeaturedSubcategoryOutput = z.infer<typeof subcategoryContract.toggleFeatured.output>

export type ReorderSubcategoryInput = z.infer<typeof subcategoryContract.reorder.input>
export type ReorderSubcategoryOutput = z.infer<typeof subcategoryContract.reorder.output>

export type SearchSubcategoryInput = z.infer<typeof subcategoryContract.search.input>
export type SearchSubcategoryOutput = z.infer<typeof subcategoryContract.search.output>

export type GetControllerInput = { input: GetSubcategoryInput }
export type GetControllerOutput = Promise<GetSubcategoryOutput>

export type GetBySlugControllerInput = { input: GetSubcategoryBySlugInput }
export type GetBySlugControllerOutput = Promise<GetSubcategoryBySlugOutput>

export type GetManyControllerInput = { input: GetSubcategoriesInput }
export type GetManyControllerOutput = Promise<GetSubcategoriesOutput>

export type CreateControllerInput = { input: CreateSubcategoryInput }
export type CreateControllerOutput = Promise<CreateSubcategoryOutput>

export type UpdateControllerInput = { input: UpdateSubcategoryInput }
export type UpdateControllerOutput = Promise<UpdateSubcategoryOutput>

export type DeleteControllerInput = { input: DeleteSubcategoryInput }
export type DeleteControllerOutput = Promise<DeleteSubcategoryOutput>

export type RestoreControllerInput = { input: RestoreSubcategoryInput }
export type RestoreControllerOutput = Promise<RestoreSubcategoryOutput>

export type ToggleVisibilityControllerInput = { input: ToggleVisibilitySubcategoryInput }
export type ToggleVisibilityControllerOutput = Promise<ToggleVisibilitySubcategoryOutput>

export type ToggleFeaturedControllerInput = { input: ToggleFeaturedSubcategoryInput }
export type ToggleFeaturedControllerOutput = Promise<ToggleFeaturedSubcategoryOutput>

export type ReorderControllerInput = { input: ReorderSubcategoryInput }
export type ReorderControllerOutput = Promise<ReorderSubcategoryOutput>

export type SearchControllerInput = { input: SearchSubcategoryInput }
export type SearchControllerOutput = Promise<SearchSubcategoryOutput>

export type GetServiceInput = GetSubcategoryInput

export type GetServiceOutput = Promise<GetSubcategoryOutput['data'] | null>

export type GetBySlugServiceInput = GetSubcategoryBySlugInput

export type GetBySlugServiceOutput = Promise<GetSubcategoryBySlugOutput['data'] | null>

export type GetManyServiceInput = GetSubcategoriesInput

export type GetManyServiceOutput = Promise<GetSubcategoriesOutput['data'] | null>

export type CreateServiceInput = {
  body: CreateSubcategoryInput['body']
}
export type CreateServiceOutput = Promise<CreateSubcategoryOutput['data'] | null>

export type UpdateServiceInput = {
  params: UpdateSubcategoryInput['params']
  body: UpdateSubcategoryInput['body']
}
export type UpdateServiceOutput = Promise<UpdateSubcategoryOutput['data'] | null>

export type DeleteServiceInput = {
  params: DeleteSubcategoryInput['params']
}
export type DeleteServiceOutput = Promise<DeleteSubcategoryOutput['data'] | null>

export type RestoreServiceInput = {
  params: RestoreSubcategoryInput['params']
}
export type RestoreServiceOutput = Promise<RestoreSubcategoryOutput['data'] | null>

export type ToggleVisibilityServiceInput = {
  params: ToggleVisibilitySubcategoryInput['params']
  body: ToggleVisibilitySubcategoryInput['body']
}
export type ToggleVisibilityServiceOutput = Promise<ToggleVisibilitySubcategoryOutput['data'] | null>

export type ToggleFeaturedServiceInput = {
  params: ToggleFeaturedSubcategoryInput['params']
  body: ToggleFeaturedSubcategoryInput['body']
}
export type ToggleFeaturedServiceOutput = Promise<ToggleFeaturedSubcategoryOutput['data'] | null>

export type ReorderServiceInput = {
  body: ReorderSubcategoryInput['body']
}
export type ReorderServiceOutput = Promise<ReorderSubcategoryOutput['data'] | null>

export type SearchServiceInput = {
  query: SearchSubcategoryInput['query']
}
export type SearchServiceOutput = Promise<SearchSubcategoryOutput['data'] | null>
