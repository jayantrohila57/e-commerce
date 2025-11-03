import {
  type CreateServiceInput,
  type CreateServiceOutput,
  type DeleteServiceInput,
  type DeleteServiceOutput,
  type GetManyServiceInput,
  type GetManyServiceOutput,
  type GetServiceInput,
  type GetServiceOutput,
  type GetUserWishlistServiceInput,
  type GetUserWishlistServiceOutput,
  type AddItemServiceInput,
  type AddItemServiceOutput,
  type RemoveItemServiceInput,
  type RemoveItemServiceOutput,
} from '../dto/types.wishlist'

import { debugError } from '@/shared/utils/lib/logger.utils'
import { db } from '@/core/db/db'
import { eq, and } from 'drizzle-orm'
import { wishlist, wishlistItem } from '@/core/db/schema'
import { v4 as uuidv4 } from 'uuid'

export const wishlistService = {
  get: async ({ body, params }: GetServiceInput): GetServiceOutput => {
    try {
      const data = await db.query.wishlist.findFirst({
        where: (w, { eq }) => {
          if (params?.id) return eq(w.id, String(params?.id))
          return undefined
        },
      })
      return data ?? null
    } catch (error) {
      debugError('SERVICE:WISHLIST:GET:ERROR', error)
      return null
    }
  },
  getMany: async ({ body }: GetManyServiceInput): GetManyServiceOutput => {
    try {
      const conditions = []
      if (body?.userId) conditions.push(eq(wishlist.userId, String(body.userId)))

      const data = await db.query.wishlist.findMany({
        where: conditions.length ? and(...conditions) : undefined,
        orderBy: (w, { desc }) => desc(w.createdAt),
        limit: body?.limit ?? 50,
        offset: body?.offset ?? 0,
      })

      return data
    } catch (error) {
      debugError('SERVICE:WISHLIST:GET_MANY:ERROR', error)
      return null
    }
  },
  getUserWishlist: async ({ params }: GetUserWishlistServiceInput): GetUserWishlistServiceOutput => {
    try {
      const data = await db.query.wishlist.findFirst({
        where: (w, { eq }) => eq(w.userId, String(params.userId)),
        with: {
          items: {
            orderBy: (item: any, { desc }: any) => desc(item.createdAt),
          },
        },
      })
      return data ?? null
    } catch (error) {
      debugError('SERVICE:WISHLIST:GET_USER_WISHLIST:ERROR', error)
      return null
    }
  },
  create: async ({ body }: CreateServiceInput): CreateServiceOutput => {
    try {
      const [data] = await db
        .insert(wishlist)
        .values({
          id: uuidv4(),
          userId: body.userId ?? null,
        })
        .returning()

      return data
    } catch (error) {
      debugError('SERVICE:WISHLIST:CREATE:ERROR', error)
      return null
    }
  },
  addItem: async ({ body }: AddItemServiceInput): AddItemServiceOutput => {
    try {
      const [data] = await db
        .insert(wishlistItem)
        .values({
          id: uuidv4(),
          wishlistId: body.wishlistId ?? null,
          productId: body.productId ?? null,
          variantId: body.variantId ?? null,
        })
        .returning()

      return data
    } catch (error) {
      debugError('SERVICE:WISHLIST:ADD_ITEM:ERROR', error)
      return null
    }
  },
  removeItem: async ({ params }: RemoveItemServiceInput): RemoveItemServiceOutput => {
    try {
      const [deleted] = await db
        .delete(wishlistItem)
        .where(eq(wishlistItem.id, String(params.id)))
        .returning({ id: wishlistItem.id })
      return deleted
    } catch (error) {
      debugError('SERVICE:WISHLIST:REMOVE_ITEM:ERROR', error)
      return null
    }
  },
  delete: async ({ params }: DeleteServiceInput): DeleteServiceOutput => {
    try {
      const [deleted] = await db
        .delete(wishlist)
        .where(eq(wishlist.id, String(params.id)))
        .returning({ id: wishlist.id })
      return deleted
    } catch (error) {
      debugError('SERVICE:WISHLIST:DELETE:ERROR', error)
      return null
    }
  },
}
