import { type productContract } from './dto.product.contract'
import type z from 'zod/v3'

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

export type GetControllerInput = { input: GetProductInput }
export type GetControllerOutput = Promise<GetProductOutput>

export type GetManyControllerInput = { input: GetCategoriesInput }
export type GetManyControllerOutput = Promise<GetCategoriesOutput>

export type GetProductWithSubcategoriesControllerInput = {
  input: GetProductWithSubcategoriesInput
}
export type GetProductWithSubcategoriesControllerOutput = Promise<GetProductWithSubcategoriesOutput>

export type CreateControllerInput = { input: CreateProductInput }
export type CreateControllerOutput = Promise<CreateProductOutput>

export type UpdateControllerInput = { input: UpdateProductInput }
export type UpdateControllerOutput = Promise<UpdateProductOutput>

export type DeleteControllerInput = { input: DeleteProductInput }
export type DeleteControllerOutput = Promise<DeleteProductOutput>

export type SearchControllerInput = { input: SearchProductInput }
export type SearchControllerOutput = Promise<SearchProductOutput>

export type GetServiceInput = { params: GetProductInput['params'] }
export type GetServiceOutput = Promise<GetProductOutput['data'] | null>

export type GetManyServiceInput = { query?: GetCategoriesInput['query'] }
export type GetManyServiceOutput = Promise<GetCategoriesOutput['data'] | null>

export type GetProductWithSubcategoriesServiceInput = {
  params: GetProductWithSubcategoriesInput['params']
}
export type GetProductWithSubcategoriesServiceOutput = Promise<GetProductWithSubcategoriesOutput['data'] | null>

export type CreateServiceInput = { body: CreateProductInput['body'] }
export type CreateServiceOutput = Promise<CreateProductOutput['data'] | null>

export type UpdateServiceInput = {
  params: UpdateProductInput['params']
  body: UpdateProductInput['body']
}
export type UpdateServiceOutput = Promise<UpdateProductOutput['data'] | null>

export type DeleteServiceInput = { params: DeleteProductInput['params'] }
export type DeleteServiceOutput = Promise<DeleteProductOutput['data'] | null>

export type SearchServiceInput = { query: SearchProductInput['query'] }
export type SearchServiceOutput = Promise<SearchProductOutput['data'] | null>
