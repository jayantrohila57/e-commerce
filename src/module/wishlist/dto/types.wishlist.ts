import { type wishlistContract } from './dto.wishlist.contract'
import type z from 'zod'

export type GetWishlistInput = z.infer<typeof wishlistContract.get.input>
export type GetWishlistOutput = z.infer<typeof wishlistContract.get.output>

export type GetWishlistsInput = z.infer<typeof wishlistContract.getMany.input>
export type GetWishlistsOutput = z.infer<typeof wishlistContract.getMany.output>

export type GetUserWishlistInput = z.infer<typeof wishlistContract.getUserWishlist.input>
export type GetUserWishlistOutput = z.infer<typeof wishlistContract.getUserWishlist.output>

export type CreateWishlistInput = z.infer<typeof wishlistContract.create.input>
export type CreateWishlistOutput = z.infer<typeof wishlistContract.create.output>

export type AddWishlistItemInput = z.infer<typeof wishlistContract.addItem.input>
export type AddWishlistItemOutput = z.infer<typeof wishlistContract.addItem.output>

export type RemoveWishlistItemInput = z.infer<typeof wishlistContract.removeItem.input>
export type RemoveWishlistItemOutput = z.infer<typeof wishlistContract.removeItem.output>

export type DeleteWishlistInput = z.infer<typeof wishlistContract.delete.input>
export type DeleteWishlistOutput = z.infer<typeof wishlistContract.delete.output>

export type GetControllerInput = { input: GetWishlistInput }
export type GetControllerOutput = Promise<GetWishlistOutput>

export type GetManyControllerInput = { input: GetWishlistsInput }
export type GetManyControllerOutput = Promise<GetWishlistsOutput>

export type GetUserWishlistControllerInput = { input: GetUserWishlistInput }
export type GetUserWishlistControllerOutput = Promise<GetUserWishlistOutput>

export type CreateControllerInput = { input: CreateWishlistInput }
export type CreateControllerOutput = Promise<CreateWishlistOutput>

export type AddItemControllerInput = { input: AddWishlistItemInput }
export type AddItemControllerOutput = Promise<AddWishlistItemOutput>

export type RemoveItemControllerInput = { input: RemoveWishlistItemInput }
export type RemoveItemControllerOutput = Promise<RemoveWishlistItemOutput>

export type DeleteControllerInput = { input: DeleteWishlistInput }
export type DeleteControllerOutput = Promise<DeleteWishlistOutput>

export type GetServiceInput = { body: GetWishlistInput['body']; params: GetWishlistInput['params'] }
export type GetServiceOutput = Promise<GetWishlistOutput['data'] | null>

export type GetManyServiceInput = { body: GetWishlistsInput['body']; params: GetWishlistsInput['params'] }
export type GetManyServiceOutput = Promise<GetWishlistsOutput['data'] | null>

export type GetUserWishlistServiceInput = { params: GetUserWishlistInput['params'] }
export type GetUserWishlistServiceOutput = Promise<GetUserWishlistOutput['data'] | null>

export type CreateServiceInput = { body: CreateWishlistInput['body'] }
export type CreateServiceOutput = Promise<CreateWishlistOutput['data'] | null>

export type AddItemServiceInput = { body: AddWishlistItemInput['body'] }
export type AddItemServiceOutput = Promise<AddWishlistItemOutput['data'] | null>

export type RemoveItemServiceInput = { params: RemoveWishlistItemInput['params'] }
export type RemoveItemServiceOutput = Promise<RemoveWishlistItemOutput['data'] | null>

export type DeleteServiceInput = { params: DeleteWishlistInput['params'] }
export type DeleteServiceOutput = Promise<DeleteWishlistOutput['data'] | null>
