import {
  type CreateServiceInput,
  type CreateServiceOutput,
  type DeleteServiceInput,
  type DeleteServiceOutput,
  type GetManyServiceInput,
  type GetManyServiceOutput,
  type GetServiceInput,
  type GetServiceOutput,
  type GetUserAddressesServiceInput,
  type GetUserAddressesServiceOutput,
  type UpdateServiceInput,
  type UpdateServiceOutput,
} from '../dto/types.address'

import { debugError } from '@/shared/utils/lib/logger.utils'
import { db } from '@/core/db/db'
import { eq, and, ilike } from 'drizzle-orm'
import { address } from '@/core/db/schema'
import { v4 as uuidv4 } from 'uuid'

export const addressService = {
  get: async ({ body, params }: GetServiceInput): GetServiceOutput => {
    try {
      const data = await db.query.address.findFirst({
        where: (a, { eq }) => {
          if (params?.id) return eq(a.id, String(params?.id))
          return undefined
        },
      })
      return data ?? null
    } catch (error) {
      debugError('SERVICE:ADDRESS:GET:ERROR', error)
      return null
    }
  },
  getMany: async ({ body }: GetManyServiceInput): GetManyServiceOutput => {
    try {
      const conditions = []
      if (body?.userId) conditions.push(eq(address.userId, String(body.userId)))
      if (body?.search) conditions.push(ilike(address.fullName, `%${body.search}%`))

      const data = await db.query.address.findMany({
        where: conditions.length ? and(...conditions) : undefined,
        orderBy: (a, { desc }) => desc(a.createdAt),
        limit: body?.limit ?? 50,
        offset: body?.offset ?? 0,
      })

      return data
    } catch (error) {
      debugError('SERVICE:ADDRESS:GET_MANY:ERROR', error)
      return null
    }
  },
  getUserAddresses: async ({ params }: GetUserAddressesServiceInput): GetUserAddressesServiceOutput => {
    try {
      const data = await db.query.address.findMany({
        where: (a, { eq }) => eq(a.userId, String(params.userId)),
        orderBy: (a, { desc }) => desc(a.createdAt),
      })
      return data
    } catch (error) {
      debugError('SERVICE:ADDRESS:GET_USER_ADDRESSES:ERROR', error)
      return null
    }
  },
  create: async ({ body }: CreateServiceInput): CreateServiceOutput => {
    try {
      const [data] = await db
        .insert(address)
        .values({
          id: uuidv4(),
          userId: body.userId ?? null,
          label: body.label ?? null,
          fullName: body.fullName ?? null,
          phone: body.phone ?? null,
          line1: body.line1 ?? null,
          line2: body.line2 ?? null,
          city: body.city ?? null,
          state: body.state ?? null,
          postalCode: body.postalCode ?? null,
          country: body.country ?? 'IN',
        })
        .returning()

      return data
    } catch (error) {
      debugError('SERVICE:ADDRESS:CREATE:ERROR', error)
      return null
    }
  },
  update: async ({ body, params }: UpdateServiceInput): UpdateServiceOutput => {
    try {
      const [data] = await db
        .update(address)
        .set({
          userId: body.userId ?? undefined,
          label: body.label ?? undefined,
          fullName: body.fullName ?? undefined,
          phone: body.phone ?? undefined,
          line1: body.line1 ?? undefined,
          line2: body.line2 ?? undefined,
          city: body.city ?? undefined,
          state: body.state ?? undefined,
          postalCode: body.postalCode ?? undefined,
          country: body.country ?? undefined,
        })
        .where(eq(address.id, String(params.id)))
        .returning()

      return data
    } catch (error) {
      debugError('SERVICE:ADDRESS:UPDATE:ERROR', error)
      return null
    }
  },
  delete: async ({ params }: DeleteServiceInput): DeleteServiceOutput => {
    try {
      const [deleted] = await db
        .delete(address)
        .where(eq(address.id, String(params.id)))
        .returning({ id: address.id })
      return deleted
    } catch (error) {
      debugError('SERVICE:ADDRESS:DELETE:ERROR', error)
      return null
    }
  },
}
