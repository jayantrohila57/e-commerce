import { type discountContract } from './dto.discount.contract'
import type z from 'zod'

export type GetDiscountInput = z.infer<typeof discountContract.get.input>
export type GetDiscountOutput = z.infer<typeof discountContract.get.output>

export type GetDiscountsInput = z.infer<typeof discountContract.getMany.input>
export type GetDiscountsOutput = z.infer<typeof discountContract.getMany.output>

export type ValidateCodeInput = z.infer<typeof discountContract.validateCode.input>
export type ValidateCodeOutput = z.infer<typeof discountContract.validateCode.output>

export type CreateDiscountInput = z.infer<typeof discountContract.create.input>
export type CreateDiscountOutput = z.infer<typeof discountContract.create.output>

export type UpdateDiscountInput = z.infer<typeof discountContract.update.input>
export type UpdateDiscountOutput = z.infer<typeof discountContract.update.output>

export type DeleteDiscountInput = z.infer<typeof discountContract.delete.input>
export type DeleteDiscountOutput = z.infer<typeof discountContract.delete.output>

export type GetControllerInput = { input: GetDiscountInput }
export type GetControllerOutput = Promise<GetDiscountOutput>

export type GetManyControllerInput = { input: GetDiscountsInput }
export type GetManyControllerOutput = Promise<GetDiscountsOutput>

export type ValidateCodeControllerInput = { input: ValidateCodeInput }
export type ValidateCodeControllerOutput = Promise<ValidateCodeOutput>

export type CreateControllerInput = { input: CreateDiscountInput }
export type CreateControllerOutput = Promise<CreateDiscountOutput>

export type UpdateControllerInput = { input: UpdateDiscountInput }
export type UpdateControllerOutput = Promise<UpdateDiscountOutput>

export type DeleteControllerInput = { input: DeleteDiscountInput }
export type DeleteControllerOutput = Promise<DeleteDiscountOutput>

export type GetServiceInput = { body: GetDiscountInput['body']; params: GetDiscountInput['params'] }
export type GetServiceOutput = Promise<GetDiscountOutput['data'] | null>

export type GetManyServiceInput = { body: GetDiscountsInput['body']; params: GetDiscountsInput['params'] }
export type GetManyServiceOutput = Promise<GetDiscountsOutput['data'] | null>

export type ValidateCodeServiceInput = { params: ValidateCodeInput['params'] }
export type ValidateCodeServiceOutput = Promise<ValidateCodeOutput['data'] | null>

export type CreateServiceInput = { body: CreateDiscountInput['body'] }
export type CreateServiceOutput = Promise<CreateDiscountOutput['data'] | null>

export type UpdateServiceInput = { body: UpdateDiscountInput['body']; params: UpdateDiscountInput['params'] }
export type UpdateServiceOutput = Promise<UpdateDiscountOutput['data'] | null>

export type DeleteServiceInput = { params: DeleteDiscountInput['params'] }
export type DeleteServiceOutput = Promise<DeleteDiscountOutput['data'] | null>
