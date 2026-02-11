import type z from 'zod/v3'
import { type wishlistContract, type wishlistSelectSchema } from './wishlist.schema'

export type WishlistItem = z.infer<typeof wishlistSelectSchema>

export type GetUserWishlistInput = z.input<typeof wishlistContract.getUserWishlist.input>
export type GetUserWishlistOutput = z.output<typeof wishlistContract.getUserWishlist.output>

export type AddWishlistItemInput = z.input<typeof wishlistContract.addItem.input>
export type AddWishlistItemOutput = z.output<typeof wishlistContract.addItem.output>

export type RemoveWishlistItemInput = z.input<typeof wishlistContract.removeItem.input>
export type RemoveWishlistItemOutput = z.output<typeof wishlistContract.removeItem.output>

export type ClearWishlistInput = z.input<typeof wishlistContract.clear.input>
export type ClearWishlistOutput = z.output<typeof wishlistContract.clear.output>
