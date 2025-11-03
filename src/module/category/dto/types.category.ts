import { type categoryContract } from './dto.category.contract'
import type z from 'zod'

export type GetCategoryInput = z.infer<typeof categoryContract.get.input>
export type GetCategoryOutput = z.infer<typeof categoryContract.get.output>

export type GetCategoriesInput = z.infer<typeof categoryContract.getMany.input>
export type GetCategoriesOutput = z.infer<typeof categoryContract.getMany.output>

export type CreateCategoryInput = z.infer<typeof categoryContract.create.input>
export type CreateCategoryOutput = z.infer<typeof categoryContract.create.output>

export type UpdateCategoryInput = z.infer<typeof categoryContract.update.input>
export type UpdateCategoryOutput = z.infer<typeof categoryContract.update.output>

export type DeleteCategoryInput = z.infer<typeof categoryContract.delete.input>
export type DeleteCategoryOutput = z.infer<typeof categoryContract.delete.output>

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

export type GetServiceInput = { body: GetCategoryInput['body']; params: GetCategoryInput['params'] }
export type GetServiceOutput = Promise<GetCategoryOutput['data'] | null>

export type GetManyServiceInput = { body: GetCategoriesInput['body']; params: GetCategoriesInput['params'] }
export type GetManyServiceOutput = Promise<GetCategoriesOutput['data'] | null>

export type CreateServiceInput = { body: CreateCategoryInput['body'] }
export type CreateServiceOutput = Promise<CreateCategoryOutput['data'] | null>

export type UpdateServiceInput = { body: UpdateCategoryInput['body']; params: UpdateCategoryInput['params'] }
export type UpdateServiceOutput = Promise<UpdateCategoryOutput['data'] | null>

export type DeleteServiceInput = { params: DeleteCategoryInput['params'] }
export type DeleteServiceOutput = Promise<DeleteCategoryOutput['data'] | null>
