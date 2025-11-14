import { type seriesContract } from './dto.series.contract'
import type z from 'zod/v3'

export type GetSeriesInput = z.infer<typeof seriesContract.get.input>
export type GetSeriesOutput = z.infer<typeof seriesContract.get.output>

export type GetSeriesBySlugInput = z.infer<typeof seriesContract.getBySlug.input>
export type GetSeriesBySlugOutput = z.infer<typeof seriesContract.getBySlug.output>

export type GetManySeriesInput = z.infer<typeof seriesContract.getMany.input>
export type GetManySeriesOutput = z.infer<typeof seriesContract.getMany.output>

export type CreateSeriesInput = z.infer<typeof seriesContract.create.input>
export type CreateSeriesOutput = z.infer<typeof seriesContract.create.output>

export type UpdateSeriesInput = z.infer<typeof seriesContract.update.input>
export type UpdateSeriesOutput = z.infer<typeof seriesContract.update.output>

export type DeleteSeriesInput = z.infer<typeof seriesContract.delete.input>
export type DeleteSeriesOutput = z.infer<typeof seriesContract.delete.output>

export type RestoreSeriesInput = z.infer<typeof seriesContract.restore.input>
export type RestoreSeriesOutput = z.infer<typeof seriesContract.restore.output>

export type ToggleVisibilitySeriesInput = z.infer<typeof seriesContract.toggleVisibility.input>
export type ToggleVisibilitySeriesOutput = z.infer<typeof seriesContract.toggleVisibility.output>

export type ToggleFeaturedSeriesInput = z.infer<typeof seriesContract.toggleFeatured.input>
export type ToggleFeaturedSeriesOutput = z.infer<typeof seriesContract.toggleFeatured.output>

export type ReorderSeriesInput = z.infer<typeof seriesContract.reorder.input>
export type ReorderSeriesOutput = z.infer<typeof seriesContract.reorder.output>

export type SearchSeriesInput = z.infer<typeof seriesContract.search.input>
export type SearchSeriesOutput = z.infer<typeof seriesContract.search.output>

export type GetControllerInput = { input: GetSeriesInput }
export type GetControllerOutput = Promise<GetSeriesOutput>

export type GetBySlugControllerInput = { input: GetSeriesBySlugInput }
export type GetBySlugControllerOutput = Promise<GetSeriesBySlugOutput>

export type GetManyControllerInput = { input: GetManySeriesInput }
export type GetManyControllerOutput = Promise<GetManySeriesOutput>

export type CreateControllerInput = { input: CreateSeriesInput }
export type CreateControllerOutput = Promise<CreateSeriesOutput>

export type UpdateControllerInput = { input: UpdateSeriesInput }
export type UpdateControllerOutput = Promise<UpdateSeriesOutput>

export type DeleteControllerInput = { input: DeleteSeriesInput }
export type DeleteControllerOutput = Promise<DeleteSeriesOutput>

export type RestoreControllerInput = { input: RestoreSeriesInput }
export type RestoreControllerOutput = Promise<RestoreSeriesOutput>

export type ToggleVisibilityControllerInput = { input: ToggleVisibilitySeriesInput }
export type ToggleVisibilityControllerOutput = Promise<ToggleVisibilitySeriesOutput>

export type ToggleFeaturedControllerInput = { input: ToggleFeaturedSeriesInput }
export type ToggleFeaturedControllerOutput = Promise<ToggleFeaturedSeriesOutput>

export type ReorderControllerInput = { input: ReorderSeriesInput }
export type ReorderControllerOutput = Promise<ReorderSeriesOutput>

export type SearchControllerInput = { input: SearchSeriesInput }
export type SearchControllerOutput = Promise<SearchSeriesOutput>

export type GetServiceInput = GetSeriesInput
export type GetServiceOutput = Promise<GetSeriesOutput['data'] | null>

export type GetBySlugServiceInput = GetSeriesBySlugInput
export type GetBySlugServiceOutput = Promise<GetSeriesBySlugOutput['data'] | null>

export type GetManyServiceInput = GetManySeriesInput
export type GetManyServiceOutput = Promise<GetManySeriesOutput['data'] | null>

export type CreateServiceInput = {
  body: CreateSeriesInput['body']
}
export type CreateServiceOutput = Promise<CreateSeriesOutput['data'] | null>

export type UpdateServiceInput = {
  params: UpdateSeriesInput['params']
  body: UpdateSeriesInput['body']
}
export type UpdateServiceOutput = Promise<UpdateSeriesOutput['data'] | null>

export type DeleteServiceInput = {
  params: DeleteSeriesInput['params']
}
export type DeleteServiceOutput = Promise<DeleteSeriesOutput['data'] | null>

export type RestoreServiceInput = {
  params: RestoreSeriesInput['params']
}
export type RestoreServiceOutput = Promise<RestoreSeriesOutput['data'] | null>

export type ToggleVisibilityServiceInput = {
  params: ToggleVisibilitySeriesInput['params']
  body: ToggleVisibilitySeriesInput['body']
}
export type ToggleVisibilityServiceOutput = Promise<ToggleVisibilitySeriesOutput['data'] | null>

export type ToggleFeaturedServiceInput = {
  params: ToggleFeaturedSeriesInput['params']
  body: ToggleFeaturedSeriesInput['body']
}
export type ToggleFeaturedServiceOutput = Promise<ToggleFeaturedSeriesOutput['data'] | null>

export type ReorderServiceInput = {
  body: ReorderSeriesInput['body']
}
export type ReorderServiceOutput = Promise<ReorderSeriesOutput['data'] | null>

export type SearchServiceInput = {
  query: SearchSeriesInput['query']
}
export type SearchServiceOutput = Promise<SearchSeriesOutput['data'] | null>
