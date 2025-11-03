import {
  type CreateServiceInput,
  type CreateServiceOutput,
  type DeleteServiceInput,
  type DeleteServiceOutput,
  type GetManyServiceInput,
  type GetManyServiceOutput,
  type GetServiceInput,
  type GetServiceOutput,
  type GetUserCartServiceInput,
  type GetUserCartServiceOutput,
  type AddItemServiceInput,
  type AddItemServiceOutput,
  type UpdateItemServiceInput,
  type UpdateItemServiceOutput,
  type RemoveItemServiceInput,
  type RemoveItemServiceOutput,
  type ClearCartServiceInput,
  type ClearCartServiceOutput,
  type UpdateServiceInput,
  type UpdateServiceOutput,
} from '../dto/types.cart'

import { debugError } from '@/shared/utils/lib/logger.utils'
import { db } from '@/core/db/db'
import { eq, and } from 'drizzle-orm'
import { cart, cartItem } from '@/core/db/schema'
import { v4 as uuidv4 } from 'uuid'

export const cartService = {
  get: async ({ body, params }: GetServiceInput): GetServiceOutput => {
    try {
      const data = await db.query.cart.findFirst({
        where: (c, { eq }) => {
          if (params?.id) return eq(c.id, String(params?.id))
          return undefined
        },
      })
      return data ?? null
    } catch (error) {
      debugError('SERVICE:CART:GET:ERROR', error)
      return null
    }
  },
  getMany: async ({ body }: GetManyServiceInput): GetManyServiceOutput => {
    try {
      const conditions = []
      if (body?.userId) conditions.push(eq(cart.userId, String(body.userId)))
      if (body?.status) conditions.push(eq(cart.status, body.status as 'active' | 'ordered' | 'abandoned'))

      const data = await db.query.cart.findMany({
        where: conditions.length ? and(...conditions) : undefined,
        orderBy: (c, { desc }) => desc(c.createdAt),
        limit: body?.limit ?? 50,
        offset: body?.offset ?? 0,
      })

      return data
    } catch (error) {
      debugError('SERVICE:CART:GET_MANY:ERROR', error)
      return null
    }
  },
  getUserCart: async ({ params }: GetUserCartServiceInput): GetUserCartServiceOutput => {
    try {
      const data = await db.query.cart.findFirst({
        where: (c, { eq, and }) => and(eq(c.userId, String(params.userId)), eq(c.status, 'active' as const)),
        with: {
          items: {
            orderBy: (item: any, { desc }: any) => desc(item.createdAt),
          },
        },
      })
      return data ?? null
    } catch (error) {
      debugError('SERVICE:CART:GET_USER_CART:ERROR', error)
      return null
    }
  },
  create: async ({ body }: CreateServiceInput): CreateServiceOutput => {
    try {
      const [data] = await db
        .insert(cart)
        .values({
          id: uuidv4(),
          userId: body.userId ?? null,
          status: (body.status ?? 'active') as 'active' | 'ordered' | 'abandoned',
        })
        .returning()

      return data
    } catch (error) {
      debugError('SERVICE:CART:CREATE:ERROR', error)
      return null
    }
  },
  addItem: async ({ body }: AddItemServiceInput): AddItemServiceOutput => {
    try {
      const [data] = await db
        .insert(cartItem)
        .values({
          id: uuidv4(),
          cartId: body.cartId ?? null,
          productId: body.productId ?? null,
          variantId: body.variantId ?? null,
          quantity: body.quantity ?? 1,
          priceAtAdd: body.priceAtAdd ?? null,
        })
        .returning()

      return data
    } catch (error) {
      debugError('SERVICE:CART:ADD_ITEM:ERROR', error)
      return null
    }
  },
  updateItem: async ({ body, params }: UpdateItemServiceInput): UpdateItemServiceOutput => {
    try {
      const [data] = await db
        .update(cartItem)
        .set({
          quantity: body.quantity,
          updatedAt: new Date(),
        })
        .where(eq(cartItem.id, String(params.id)))
        .returning()

      return data
    } catch (error) {
      debugError('SERVICE:CART:UPDATE_ITEM:ERROR', error)
      return null
    }
  },
  removeItem: async ({ params }: RemoveItemServiceInput): RemoveItemServiceOutput => {
    try {
      const [deleted] = await db
        .delete(cartItem)
        .where(eq(cartItem.id, String(params.id)))
        .returning({ id: cartItem.id })
      return deleted
    } catch (error) {
      debugError('SERVICE:CART:REMOVE_ITEM:ERROR', error)
      return null
    }
  },
  clearCart: async ({ params }: ClearCartServiceInput): ClearCartServiceOutput => {
    try {
      await db.delete(cartItem).where(eq(cartItem.cartId, String(params.cartId)))
      return { cartId: String(params.cartId), cleared: true }
    } catch (error) {
      debugError('SERVICE:CART:CLEAR_CART:ERROR', error)
      return { cartId: String(params.cartId), cleared: false }
    }
  },
  update: async ({ body, params }: UpdateServiceInput): UpdateServiceOutput => {
    try {
      const [data] = await db
        .update(cart)
        .set({
          userId: body.userId ?? undefined,
          status: body.status ? (body.status as 'active' | 'ordered' | 'abandoned') : undefined,
          updatedAt: new Date(),
        })
        .where(eq(cart.id, String(params.id)))
        .returning()

      return data
    } catch (error) {
      debugError('SERVICE:CART:UPDATE:ERROR', error)
      return null
    }
  },
  delete: async ({ params }: DeleteServiceInput): DeleteServiceOutput => {
    try {
      const [deleted] = await db
        .delete(cart)
        .where(eq(cart.id, String(params.id)))
        .returning({ id: cart.id })
      return deleted
    } catch (error) {
      debugError('SERVICE:CART:DELETE:ERROR', error)
      return null
    }
  },
}
