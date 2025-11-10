import { type cartContract } from './dto.cart.contract'
import type z from 'zod/v3'

export type GetCartInput = z.infer<typeof cartContract.get.input>
export type GetCartOutput = z.infer<typeof cartContract.get.output>

export type GetCartsInput = z.infer<typeof cartContract.getMany.input>
export type GetCartsOutput = z.infer<typeof cartContract.getMany.output>

export type GetUserCartInput = z.infer<typeof cartContract.getUserCart.input>
export type GetUserCartOutput = z.infer<typeof cartContract.getUserCart.output>

export type CreateCartInput = z.infer<typeof cartContract.create.input>
export type CreateCartOutput = z.infer<typeof cartContract.create.output>

export type AddCartItemInput = z.infer<typeof cartContract.addItem.input>
export type AddCartItemOutput = z.infer<typeof cartContract.addItem.output>

export type UpdateCartItemInput = z.infer<typeof cartContract.updateItem.input>
export type UpdateCartItemOutput = z.infer<typeof cartContract.updateItem.output>

export type RemoveCartItemInput = z.infer<typeof cartContract.removeItem.input>
export type RemoveCartItemOutput = z.infer<typeof cartContract.removeItem.output>

export type ClearCartInput = z.infer<typeof cartContract.clearCart.input>
export type ClearCartOutput = z.infer<typeof cartContract.clearCart.output>

export type UpdateCartInput = z.infer<typeof cartContract.update.input>
export type UpdateCartOutput = z.infer<typeof cartContract.update.output>

export type DeleteCartInput = z.infer<typeof cartContract.delete.input>
export type DeleteCartOutput = z.infer<typeof cartContract.delete.output>

export type GetControllerInput = { input: GetCartInput }
export type GetControllerOutput = Promise<GetCartOutput>

export type GetManyControllerInput = { input: GetCartsInput }
export type GetManyControllerOutput = Promise<GetCartsOutput>

export type GetUserCartControllerInput = { input: GetUserCartInput }
export type GetUserCartControllerOutput = Promise<GetUserCartOutput>

export type CreateControllerInput = { input: CreateCartInput }
export type CreateControllerOutput = Promise<CreateCartOutput>

export type AddItemControllerInput = { input: AddCartItemInput }
export type AddItemControllerOutput = Promise<AddCartItemOutput>

export type UpdateItemControllerInput = { input: UpdateCartItemInput }
export type UpdateItemControllerOutput = Promise<UpdateCartItemOutput>

export type RemoveItemControllerInput = { input: RemoveCartItemInput }
export type RemoveItemControllerOutput = Promise<RemoveCartItemOutput>

export type ClearCartControllerInput = { input: ClearCartInput }
export type ClearCartControllerOutput = Promise<ClearCartOutput>

export type UpdateControllerInput = { input: UpdateCartInput }
export type UpdateControllerOutput = Promise<UpdateCartOutput>

export type DeleteControllerInput = { input: DeleteCartInput }
export type DeleteControllerOutput = Promise<DeleteCartOutput>

export type GetServiceInput = { body: GetCartInput['body']; params: GetCartInput['params'] }
export type GetServiceOutput = Promise<GetCartOutput['data'] | null>

export type GetManyServiceInput = { body: GetCartsInput['body']; params: GetCartsInput['params'] }
export type GetManyServiceOutput = Promise<GetCartsOutput['data'] | null>

export type GetUserCartServiceInput = { params: GetUserCartInput['params'] }
export type GetUserCartServiceOutput = Promise<GetUserCartOutput['data'] | null>

export type CreateServiceInput = { body: CreateCartInput['body'] }
export type CreateServiceOutput = Promise<CreateCartOutput['data'] | null>

export type AddItemServiceInput = { body: AddCartItemInput['body'] }
export type AddItemServiceOutput = Promise<AddCartItemOutput['data'] | null>

export type UpdateItemServiceInput = { body: UpdateCartItemInput['body']; params: UpdateCartItemInput['params'] }
export type UpdateItemServiceOutput = Promise<UpdateCartItemOutput['data'] | null>

export type RemoveItemServiceInput = { params: RemoveCartItemInput['params'] }
export type RemoveItemServiceOutput = Promise<RemoveCartItemOutput['data'] | null>

export type ClearCartServiceInput = { params: ClearCartInput['params'] }
export type ClearCartServiceOutput = Promise<ClearCartOutput['data'] | null>

export type UpdateServiceInput = { body: UpdateCartInput['body']; params: UpdateCartInput['params'] }
export type UpdateServiceOutput = Promise<UpdateCartOutput['data'] | null>

export type DeleteServiceInput = { params: DeleteCartInput['params'] }
export type DeleteServiceOutput = Promise<DeleteCartOutput['data'] | null>
