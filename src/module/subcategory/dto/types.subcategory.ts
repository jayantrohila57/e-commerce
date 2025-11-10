import { type subcategoryContract } from './dto.subcategory.contract'
import type z from 'zod/v3'

export type GetSubcategoryInput = z.infer<typeof subcategoryContract.get.input>
export type GetSubcategoryOutput = z.infer<typeof subcategoryContract.get.output>

export type GetSubcategoriesInput = z.infer<typeof subcategoryContract.getMany.input>
export type GetSubcategoriesOutput = z.infer<typeof subcategoryContract.getMany.output>

export type CreateSubcategoryInput = z.infer<typeof subcategoryContract.create.input>
export type CreateSubcategoryOutput = z.infer<typeof subcategoryContract.create.output>

export type UpdateSubcategoryInput = z.infer<typeof subcategoryContract.update.input>
export type UpdateSubcategoryOutput = z.infer<typeof subcategoryContract.update.output>

export type DeleteSubcategoryInput = z.infer<typeof subcategoryContract.delete.input>
export type DeleteSubcategoryOutput = z.infer<typeof subcategoryContract.delete.output>

export type GetControllerInput = { input: GetSubcategoryInput }
export type GetControllerOutput = Promise<GetSubcategoryOutput>

export type GetManyControllerInput = { input: GetSubcategoriesInput }
export type GetManyControllerOutput = Promise<GetSubcategoriesOutput>

export type CreateControllerInput = { input: CreateSubcategoryInput }
export type CreateControllerOutput = Promise<CreateSubcategoryOutput>

export type UpdateControllerInput = { input: UpdateSubcategoryInput }
export type UpdateControllerOutput = Promise<UpdateSubcategoryOutput>

export type DeleteControllerInput = { input: DeleteSubcategoryInput }
export type DeleteControllerOutput = Promise<DeleteSubcategoryOutput>

export type GetServiceInput = { body: GetSubcategoryInput['body']; params: GetSubcategoryInput['params'] }
export type GetServiceOutput = Promise<GetSubcategoryOutput['data'] | null>

export type GetManyServiceInput = { body: GetSubcategoriesInput['body']; params: GetSubcategoriesInput['params'] }
export type GetManyServiceOutput = Promise<GetSubcategoriesOutput['data'] | null>

export type CreateServiceInput = { body: CreateSubcategoryInput['body'] }
export type CreateServiceOutput = Promise<CreateSubcategoryOutput['data'] | null>

export type UpdateServiceInput = { body: UpdateSubcategoryInput['body']; params: UpdateSubcategoryInput['params'] }
export type UpdateServiceOutput = Promise<UpdateSubcategoryOutput['data'] | null>

export type DeleteServiceInput = { params: DeleteSubcategoryInput['params'] }
export type DeleteServiceOutput = Promise<DeleteSubcategoryOutput['data'] | null>
