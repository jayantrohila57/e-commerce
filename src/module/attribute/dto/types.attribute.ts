import { type attributeContract } from './dto.attribute.contract'
import type z from 'zod/v3'

export type GetAttributeInput = z.infer<typeof attributeContract.get.input>
export type GetAttributeOutput = z.infer<typeof attributeContract.get.output>

export type GetAttributeBySlugInput = z.infer<typeof attributeContract.getBySlug.input>
export type GetAttributeBySlugOutput = z.infer<typeof attributeContract.getBySlug.output>

export type GetAttributesBySeriesInput = z.infer<typeof attributeContract.getBySeries.input>
export type GetAttributesBySeriesOutput = z.infer<typeof attributeContract.getBySeries.output>

export type GetManyAttributesInput = z.infer<typeof attributeContract.getMany.input>
export type GetManyAttributesOutput = z.infer<typeof attributeContract.getMany.output>

export type CreateAttributeInput = z.infer<typeof attributeContract.create.input>
export type CreateAttributeOutput = z.infer<typeof attributeContract.create.output>

export type UpdateAttributeInput = z.infer<typeof attributeContract.update.input>
export type UpdateAttributeOutput = z.infer<typeof attributeContract.update.output>

export type DeleteAttributeInput = z.infer<typeof attributeContract.delete.input>
export type DeleteAttributeOutput = z.infer<typeof attributeContract.delete.output>

export type RestoreAttributeInput = z.infer<typeof attributeContract.restore.input>
export type RestoreAttributeOutput = z.infer<typeof attributeContract.restore.output>

export type ToggleVisibilityInput = z.infer<typeof attributeContract.toggleVisibility.input>
export type ToggleVisibilityOutput = z.infer<typeof attributeContract.toggleVisibility.output>

export type ToggleFeaturedInput = z.infer<typeof attributeContract.toggleFeatured.input>
export type ToggleFeaturedOutput = z.infer<typeof attributeContract.toggleFeatured.output>

export type ReorderAttributesInput = z.infer<typeof attributeContract.reorder.input>
export type ReorderAttributesOutput = z.infer<typeof attributeContract.reorder.output>

export type SearchAttributeInput = z.infer<typeof attributeContract.search.input>
export type SearchAttributeOutput = z.infer<typeof attributeContract.search.output>

export type GetControllerInput = { input: GetAttributeInput }
export type GetControllerOutput = Promise<GetAttributeOutput>

export type GetBySlugControllerInput = { input: GetAttributeBySlugInput }
export type GetBySlugControllerOutput = Promise<GetAttributeBySlugOutput>

export type GetBySeriesControllerInput = { input: GetAttributesBySeriesInput }
export type GetBySeriesControllerOutput = Promise<GetAttributesBySeriesOutput>

export type GetManyControllerInput = { input: GetManyAttributesInput }
export type GetManyControllerOutput = Promise<GetManyAttributesOutput>

export type CreateControllerInput = { input: CreateAttributeInput }
export type CreateControllerOutput = Promise<CreateAttributeOutput>

export type UpdateControllerInput = { input: UpdateAttributeInput }
export type UpdateControllerOutput = Promise<UpdateAttributeOutput>

export type DeleteControllerInput = { input: DeleteAttributeInput }
export type DeleteControllerOutput = Promise<DeleteAttributeOutput>

export type RestoreControllerInput = { input: RestoreAttributeInput }
export type RestoreControllerOutput = Promise<RestoreAttributeOutput>

export type ToggleVisibilityControllerInput = { input: ToggleVisibilityInput }
export type ToggleVisibilityControllerOutput = Promise<ToggleVisibilityOutput>

export type ToggleFeaturedControllerInput = { input: ToggleFeaturedInput }
export type ToggleFeaturedControllerOutput = Promise<ToggleFeaturedOutput>

export type ReorderControllerInput = { input: ReorderAttributesInput }
export type ReorderControllerOutput = Promise<ReorderAttributesOutput>

export type SearchControllerInput = { input: SearchAttributeInput }
export type SearchControllerOutput = Promise<SearchAttributeOutput>


export type GetServiceInput = GetAttributeInput['params']
export type GetServiceOutput = Promise<GetAttributeOutput['data']>

export type GetBySlugServiceInput = GetAttributeBySlugInput['params']
export type GetBySlugServiceOutput = Promise<GetAttributeBySlugOutput['data']>

export type GetBySeriesServiceInput = GetAttributesBySeriesInput['params'] & {
  query?: GetAttributesBySeriesInput['query']
}
export type GetBySeriesServiceOutput = Promise<GetAttributesBySeriesOutput['data']>

export type GetManyServiceInput = GetManyAttributesInput['query'] extends undefined
  ? void
  : GetManyAttributesInput['query']
export type GetManyServiceOutput = Promise<GetManyAttributesOutput['data']>

export type CreateServiceInput = CreateAttributeInput['body']
export type CreateServiceOutput = Promise<CreateAttributeOutput['data']>

export type UpdateServiceInput = {
  params: UpdateAttributeInput['params']
  body: UpdateAttributeInput['body']
}
export type UpdateServiceOutput = Promise<UpdateAttributeOutput['data']>

export type DeleteServiceInput = DeleteAttributeInput['params']
export type DeleteServiceOutput = Promise<DeleteAttributeOutput['data']>

export type RestoreServiceInput = RestoreAttributeInput['params']
export type RestoreServiceOutput = Promise<RestoreAttributeOutput['data']>

export type ToggleVisibilityServiceInput = {
  params: ToggleVisibilityInput['params']
  body: ToggleVisibilityInput['body']
}
export type ToggleVisibilityServiceOutput = Promise<ToggleVisibilityOutput['data']>

export type ToggleFeaturedServiceInput = {
  params: ToggleFeaturedInput['params']
  body: ToggleFeaturedInput['body']
}
export type ToggleFeaturedServiceOutput = Promise<ToggleFeaturedOutput['data']>

export type ReorderServiceInput = ReorderAttributesInput['body']
export type ReorderServiceOutput = Promise<ReorderAttributesOutput['data']>

export type SearchServiceInput = SearchAttributeInput['query']
export type SearchServiceOutput = Promise<SearchAttributeOutput['data']>
