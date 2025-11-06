import { and, eq, ilike, ne, or, sql, type SQL } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'

import { db } from '@/core/db/db'
import { address } from '../dto/dto.address.schema'
import { debugError } from '@/shared/utils/lib/logger.utils'
import type {
  CreateServiceInput,
  CreateServiceOutput,
  DeleteServiceInput,
  DeleteServiceOutput,
  GetManyServiceInput,
  GetManyServiceOutput,
  GetServiceInput,
  GetServiceOutput,
  GetUserAddressesServiceInput,
  GetUserAddressesServiceOutput,
  UpdateServiceInput,
  UpdateServiceOutput,
} from '../dto/types.address'
import type { AddressInsert, AddressUpdate } from '../dto/dto.address.contract'

export const addressService = {
  get: async (params: GetServiceInput): GetServiceOutput => {
    try {
      if (!params?.id) return null

      const data = await db.query.address.findFirst({
        where: (a, { eq }) => eq(a.id, params.id),
      })

      return data ?? null
    } catch (error) {
      debugError('SERVICE:ADDRESS:GET:ERROR', error)
      return null
    }
  },

  getMany: async (query: GetManyServiceInput): Promise<GetManyServiceOutput> => {
    try {
      const conditions: SQL[] = []
      const { userId, search, type, isDefault, limit = 50, offset = 0 } = query || {}

      if (userId) conditions.push(eq(address.userId, String(userId)))
      if (type) conditions.push(eq(address.type, type))
      if (typeof isDefault === 'boolean') conditions.push(eq(address.isDefault, isDefault))

      if (search) {
        const searchTerm = `%${search}%`
        const searchConditions =
          [
            ilike(address.addressLine1, searchTerm),
            ilike(address.city, searchTerm),
            ilike(address.state, searchTerm),
            ilike(address.postalCode, searchTerm),
          ]?.filter((condition): condition is SQL => condition !== undefined) ?? []

        if (searchConditions.length === 1) {
          conditions.push(searchConditions[0])
        } else if (searchConditions.length > 1) {
          conditions.push(or(...searchConditions)!)
        }
      }

      const [data, total] = await Promise.all([
        db.query.address.findMany({
          where: conditions.length > 0 ? and(...conditions) : undefined,
          orderBy: (a, { desc }) => [desc(a.isDefault), desc(a.updatedAt)],
          limit,
          offset,
        }),
        db
          .select({ count: sql<number>`count(*)` })
          .from(address)
          .where(conditions.length ? and(...conditions) : undefined)
          .then((res) => Number(res[0]?.count ?? 0)),
      ])

      return {
        data,
        total,
        limit,
        offset,
      }
    } catch (error) {
      debugError('SERVICE:ADDRESS:GET_MANY:ERROR', error)
      return { data: [], total: 0, limit: 0, offset: 0 }
    }
  },

  getUserAddresses: async (params: GetUserAddressesServiceInput): GetUserAddressesServiceOutput => {
    try {
      const data = await db.query.address.findMany({
        where: (a, { eq }) => eq(a.userId, params.userId),
        orderBy: (a, { desc }) => [desc(a.isDefault), desc(a.updatedAt)],
      })
      return data
    } catch (error) {
      debugError('SERVICE:ADDRESS:GET_USER_ADDRESSES:ERROR', error)
      return []
    }
  },

  create: async (body: CreateServiceInput): Promise<CreateServiceOutput> => {
    try {
      const addressData: Omit<AddressInsert, 'id' | 'createdAt' | 'updatedAt'> = {
        userId: body.userId,
        type: body.type ?? 'home',
        addressLine1: body.addressLine1,
        addressLine2: body.addressLine2,
        landmark: body.landmark,
        city: body.city,
        state: body.state,
        postalCode: body.postalCode,
        isDefault: body.isDefault ?? false,
        country: body.country ?? 'IN',
        zoneId: body.zoneId,
      }

      const [data] = await db
        .insert(address)
        .values({
          id: uuidv4(),
          userId: addressData.userId,
          type: addressData.type,
          addressLine1: addressData.addressLine1,
          addressLine2: addressData.addressLine2,
          landmark: addressData.landmark,
          city: addressData.city,
          state: addressData.state,
          postalCode: addressData.postalCode,
          isDefault: addressData.isDefault,
          country: addressData.country,
          zoneId: addressData.zoneId,
        })
        .returning()

      // If this is set as default, update other addresses
      if (data?.isDefault) {
        await db
          .update(address)
          .set({ isDefault: false })
          .where(and(eq(address.userId, data.userId), eq(address.isDefault, true), ne(address.id, data.id)))
      }

      return data
    } catch (error) {
      debugError('SERVICE:ADDRESS:CREATE:ERROR', error)
      return null
    }
  },

  update: async ({ update: body, id }: UpdateServiceInput): Promise<UpdateServiceOutput> => {
    try {
      const updateData: Omit<AddressUpdate, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
        type: body.type,
        addressLine1: body.addressLine1,
        addressLine2: body.addressLine2,
        landmark: body.landmark,
        city: body.city,
        state: body.state,
        postalCode: body.postalCode,
        isDefault: body.isDefault,
        country: body.country,
        zoneId: body.zoneId,
      }

      const [data] = await db.update(address).set(updateData).where(eq(address.id, id)).returning()

      return data
    } catch (error) {
      debugError('SERVICE:ADDRESS:UPDATE:ERROR', error)
      return null
    }
  },
  delete: async (params: DeleteServiceInput): DeleteServiceOutput => {
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
