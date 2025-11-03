import {
  type CreateServiceInput,
  type CreateServiceOutput,
  type DeleteServiceInput,
  type DeleteServiceOutput,
  type GetManyServiceInput,
  type GetManyServiceOutput,
  type GetServiceInput,
  type GetServiceOutput,
  type GetOrderShipmentsServiceInput,
  type GetOrderShipmentsServiceOutput,
  type UpdateServiceInput,
  type UpdateServiceOutput,
  type UpdateTrackingServiceInput,
  type UpdateTrackingServiceOutput,
} from '../dto/types.shipment'

import { debugError } from '@/shared/utils/lib/logger.utils'
import { db } from '@/core/db/db'
import { eq, and } from 'drizzle-orm'
import { shipment } from '@/core/db/schema'
import { v4 as uuidv4 } from 'uuid'

export const shipmentService = {
  get: async ({ body, params }: GetServiceInput): GetServiceOutput => {
    try {
      const data = await db.query.shipment.findFirst({
        where: (s, { eq }) => {
          if (params?.id) return eq(s.id, String(params?.id))
          return undefined
        },
      })
      return data ?? null
    } catch (error) {
      debugError('SERVICE:SHIPMENT:GET:ERROR', error)
      return null
    }
  },
  getMany: async ({ body }: GetManyServiceInput): GetManyServiceOutput => {
    try {
      const conditions = []
      if (body?.orderId) conditions.push(eq(shipment.orderId, String(body.orderId)))
      if (body?.status) conditions.push(eq(shipment.status, body.status as 'pending' | 'in_transit' | 'delivered'))

      const data = await db.query.shipment.findMany({
        where: conditions.length ? and(...conditions) : undefined,
        orderBy: (s, { desc }) => desc(s.createdAt),
        limit: body?.limit ?? 50,
        offset: body?.offset ?? 0,
      })

      return data
    } catch (error) {
      debugError('SERVICE:SHIPMENT:GET_MANY:ERROR', error)
      return null
    }
  },
  getOrderShipments: async ({ params }: GetOrderShipmentsServiceInput): GetOrderShipmentsServiceOutput => {
    try {
      const data = await db.query.shipment.findMany({
        where: (s, { eq }) => eq(s.orderId, String(params.orderId)),
        orderBy: (s, { desc }) => desc(s.createdAt),
      })
      return data
    } catch (error) {
      debugError('SERVICE:SHIPMENT:GET_ORDER_SHIPMENTS:ERROR', error)
      return null
    }
  },
  create: async ({ body }: CreateServiceInput): CreateServiceOutput => {
    try {
      const [data] = await db
        .insert(shipment)
        .values({
          id: uuidv4(),
          orderId: body.orderId ?? null,
          carrier: body.carrier ?? null,
          trackingNumber: body.trackingNumber ?? null,
          status: body.status ?? 'pending',
          estimatedDelivery: body.estimatedDelivery ?? null,
        })
        .returning()

      return data
    } catch (error) {
      debugError('SERVICE:SHIPMENT:CREATE:ERROR', error)
      return null
    }
  },
  update: async ({ body, params }: UpdateServiceInput): UpdateServiceOutput => {
    try {
      const [data] = await db
        .update(shipment)
        .set({
          orderId: body.orderId ?? undefined,
          carrier: body.carrier ?? undefined,
          trackingNumber: body.trackingNumber ?? undefined,
          status: body.status ?? undefined,
          estimatedDelivery: body.estimatedDelivery ?? undefined,
        })
        .where(eq(shipment.id, String(params.id)))
        .returning()

      return data
    } catch (error) {
      debugError('SERVICE:SHIPMENT:UPDATE:ERROR', error)
      return null
    }
  },
  updateTracking: async ({ body, params }: UpdateTrackingServiceInput): UpdateTrackingServiceOutput => {
    try {
      const [data] = await db
        .update(shipment)
        .set({
          carrier: body.carrier ?? undefined,
          trackingNumber: body.trackingNumber ?? undefined,
          status: body.status ? (body.status as 'pending' | 'in_transit' | 'delivered') : undefined,
        })
        .where(eq(shipment.id, String(params.id)))
        .returning()

      return data
    } catch (error) {
      debugError('SERVICE:SHIPMENT:UPDATE_TRACKING:ERROR', error)
      return null
    }
  },
  delete: async ({ params }: DeleteServiceInput): DeleteServiceOutput => {
    try {
      const [deleted] = await db
        .delete(shipment)
        .where(eq(shipment.id, String(params.id)))
        .returning({ id: shipment.id })
      return deleted
    } catch (error) {
      debugError('SERVICE:SHIPMENT:DELETE:ERROR', error)
      return null
    }
  },
}
