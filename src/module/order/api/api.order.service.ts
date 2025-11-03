import {
  type CreateServiceInput,
  type CreateServiceOutput,
  type DeleteServiceInput,
  type DeleteServiceOutput,
  type GetManyServiceInput,
  type GetManyServiceOutput,
  type GetServiceInput,
  type GetServiceOutput,
  type GetUserOrdersServiceInput,
  type GetUserOrdersServiceOutput,
  type GetOrderWithItemsServiceInput,
  type GetOrderWithItemsServiceOutput,
  type UpdateServiceInput,
  type UpdateServiceOutput,
  type CancelOrderServiceInput,
  type CancelOrderServiceOutput,
} from '../dto/types.order'

import { debugError } from '@/shared/utils/lib/logger.utils'
import { db } from '@/core/db/db'
import { eq, and } from 'drizzle-orm'
import { order, orderItem } from '@/core/db/schema'
import { v4 as uuidv4 } from 'uuid'

export const orderService = {
  get: async ({ body, params }: GetServiceInput): GetServiceOutput => {
    try {
      const data = await db.query.order.findFirst({
        where: (o, { eq }) => {
          if (params?.id) return eq(o.id, String(params?.id))
          return undefined
        },
      })
      return data ?? null
    } catch (error) {
      debugError('SERVICE:ORDER:GET:ERROR', error)
      return null
    }
  },
  getMany: async ({ body }: GetManyServiceInput): GetManyServiceOutput => {
    try {
      const conditions = []
      if (body?.userId) conditions.push(eq(order.userId, String(body.userId)))
      if (body?.status)
        conditions.push(eq(order.status, body.status as 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'))

      const data = await db.query.order.findMany({
        where: conditions.length ? and(...conditions) : undefined,
        orderBy: (o, { desc }) => desc(o.createdAt),
        limit: body?.limit ?? 50,
        offset: body?.offset ?? 0,
      })

      return data
    } catch (error) {
      debugError('SERVICE:ORDER:GET_MANY:ERROR', error)
      return null
    }
  },
  getUserOrders: async ({ body, params }: GetUserOrdersServiceInput): GetUserOrdersServiceOutput => {
    try {
      const conditions = [eq(order.userId, String(params.userId))]
      if (body?.status)
        conditions.push(eq(order.status, body.status as 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'))

      const data = await db.query.order.findMany({
        where: and(...conditions),
        with: {
          items: {
            orderBy: (item: any, { desc }: any) => desc(item.createdAt),
          },
        },
        orderBy: (o, { desc }) => desc(o.createdAt),
        limit: body?.limit ?? 50,
        offset: body?.offset ?? 0,
      })
      return data
    } catch (error) {
      debugError('SERVICE:ORDER:GET_USER_ORDERS:ERROR', error)
      return null
    }
  },
  getOrderWithItems: async ({ params }: GetOrderWithItemsServiceInput): GetOrderWithItemsServiceOutput => {
    try {
      const data = await db.query.order.findFirst({
        where: (o, { eq }) => eq(o.id, String(params.id)),
        with: {
          items: {
            orderBy: (item: any, { desc }: any) => desc(item.createdAt),
          },
        },
      })
      return data ?? null
    } catch (error) {
      debugError('SERVICE:ORDER:GET_ORDER_WITH_ITEMS:ERROR', error)
      return null
    }
  },
  create: async ({ body }: CreateServiceInput): CreateServiceOutput => {
    try {
      const orderId = uuidv4()
      const [orderData] = await db
        .insert(order)
        .values({
          id: orderId,
          userId: body.userId ?? null,
          status: body.status ?? 'pending',
          total: body.total ?? null,
          currency: body.currency ?? 'INR',
          paymentId: body.paymentId ?? null,
          addressId: body.addressId ?? null,
        })
        .returning()

      if (body.items && body.items.length > 0) {
        await db.insert(orderItem).values(
          body.items.map((item) => ({
            id: uuidv4(),
            orderId: orderId,
            productId: item.productId ?? null,
            variantId: item.variantId ?? null,
            quantity: item.quantity ?? 1,
            price: item.price ?? null,
          })),
        )
      }

      const result = await db.query.order.findFirst({
        where: (o, { eq }) => eq(o.id, orderId),
        with: {
          items: true,
        },
      })

      return result ?? null
    } catch (error) {
      debugError('SERVICE:ORDER:CREATE:ERROR', error)
      return null
    }
  },
  update: async ({ body, params }: UpdateServiceInput): UpdateServiceOutput => {
    try {
      const [data] = await db
        .update(order)
        .set({
          userId: body.userId ?? undefined,
          status: body.status ?? undefined,
          total: body.total ?? undefined,
          currency: body.currency ?? undefined,
          paymentId: body.paymentId ?? undefined,
          addressId: body.addressId ?? undefined,
        })
        .where(eq(order.id, String(params.id)))
        .returning()

      return data
    } catch (error) {
      debugError('SERVICE:ORDER:UPDATE:ERROR', error)
      return null
    }
  },
  cancelOrder: async ({ params }: CancelOrderServiceInput): CancelOrderServiceOutput => {
    try {
      const [data] = await db
        .update(order)
        .set({
          status: 'cancelled',
        })
        .where(eq(order.id, String(params.id)))
        .returning()

      return data
    } catch (error) {
      debugError('SERVICE:ORDER:CANCEL_ORDER:ERROR', error)
      return null
    }
  },
  delete: async ({ params }: DeleteServiceInput): DeleteServiceOutput => {
    try {
      const [deleted] = await db
        .delete(order)
        .where(eq(order.id, String(params.id)))
        .returning({ id: order.id })
      return deleted
    } catch (error) {
      debugError('SERVICE:ORDER:DELETE:ERROR', error)
      return null
    }
  },
}
