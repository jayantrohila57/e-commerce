import { type productContract } from './dto.product.contract'
import type z from 'zod'

export type GetProductInput = z.infer<typeof productContract.get.input>
export type GetProductOutput = z.infer<typeof productContract.get.output>

export type GetProductWithDetailsInput = z.infer<typeof productContract.getWithDetails.input>
export type GetProductWithDetailsOutput = z.infer<typeof productContract.getWithDetails.output>

export type GetProductsInput = z.infer<typeof productContract.getMany.input>
export type GetProductsOutput = z.infer<typeof productContract.getMany.output>

export type SearchProductsInput = z.infer<typeof productContract.searchProducts.input>
export type SearchProductsOutput = z.infer<typeof productContract.searchProducts.output>

export type GetProductsByCategoryInput = z.infer<typeof productContract.getProductsByCategory.input>
export type GetProductsByCategoryOutput = z.infer<typeof productContract.getProductsByCategory.output>

export type CreateProductInput = z.infer<typeof productContract.create.input>
export type CreateProductOutput = z.infer<typeof productContract.create.output>

export type UpdateProductInput = z.infer<typeof productContract.update.input>
export type UpdateProductOutput = z.infer<typeof productContract.update.output>

export type DeleteProductInput = z.infer<typeof productContract.delete.input>
export type DeleteProductOutput = z.infer<typeof productContract.delete.output>

export type GetControllerInput = { input: GetProductInput }
export type GetControllerOutput = Promise<GetProductOutput>

export type GetWithDetailsControllerInput = { input: GetProductWithDetailsInput }
export type GetWithDetailsControllerOutput = Promise<GetProductWithDetailsOutput>

export type GetManyControllerInput = { input: GetProductsInput }
export type GetManyControllerOutput = Promise<GetProductsOutput>

export type SearchProductsControllerInput = { input: SearchProductsInput }
export type SearchProductsControllerOutput = Promise<SearchProductsOutput>

export type GetProductsByCategoryControllerInput = { input: GetProductsByCategoryInput }
export type GetProductsByCategoryControllerOutput = Promise<GetProductsByCategoryOutput>

export type CreateControllerInput = { input: CreateProductInput }
export type CreateControllerOutput = Promise<CreateProductOutput>

export type UpdateControllerInput = { input: UpdateProductInput }
export type UpdateControllerOutput = Promise<UpdateProductOutput>

export type DeleteControllerInput = { input: DeleteProductInput }
export type DeleteControllerOutput = Promise<DeleteProductOutput>

export type GetServiceInput = { body: GetProductInput['body']; params: GetProductInput['params'] }
export type GetServiceOutput = Promise<GetProductOutput['data'] | null>

export type GetWithDetailsServiceInput = {
  body: GetProductWithDetailsInput['body']
  params: GetProductWithDetailsInput['params']
}
export type GetWithDetailsServiceOutput = Promise<GetProductWithDetailsOutput['data'] | null>

export type GetManyServiceInput = { body: GetProductsInput['body']; params: GetProductsInput['params'] }
export type GetManyServiceOutput = Promise<GetProductsOutput['data'] | null>

export type SearchProductsServiceInput = { body: SearchProductsInput['body'] }
export type SearchProductsServiceOutput = Promise<SearchProductsOutput['data'] | null>

export type GetProductsByCategoryServiceInput = {
  body: GetProductsByCategoryInput['body']
  params: GetProductsByCategoryInput['params']
}
export type GetProductsByCategoryServiceOutput = Promise<GetProductsByCategoryOutput['data'] | null>

export type CreateServiceInput = { body: CreateProductInput['body'] }
export type CreateServiceOutput = Promise<CreateProductOutput['data'] | null>

export type UpdateServiceInput = { body: UpdateProductInput['body']; params: UpdateProductInput['params'] }
export type UpdateServiceOutput = Promise<UpdateProductOutput['data'] | null>

export type DeleteServiceInput = { params: DeleteProductInput['params'] }
export type DeleteServiceOutput = Promise<DeleteProductOutput['data'] | null>
