import {
  type CreateServiceInput,
  type CreateServiceOutput,
  type DeleteServiceInput,
  type DeleteServiceOutput,
  type GetManyServiceInput,
  type GetManyServiceOutput,
  type GetServiceInput,
  type GetServiceOutput,
  type ValidateCodeServiceInput,
  type ValidateCodeServiceOutput,
  type UpdateServiceInput,
  type UpdateServiceOutput,
} from '../dto/types.discount'

import { debugError } from '@/shared/utils/lib/logger.utils'
import { db } from '@/core/db/db'
import { eq, and, gt } from 'drizzle-orm'
import { discount } from '@/core/db/schema'
import { v4 as uuidv4 } from 'uuid'

export const discountService = {
  get: async ({ body, params }: GetServiceInput): GetServiceOutput => {
    try {
      const data = await db.query.discount.findFirst({
        where: (d, { eq }) => {
          if (params?.id) return eq(d.id, String(params.id))
          if (params?.code) return eq(d.code, String(params.code))
          return undefined
        },
      })
      return data ?? null
    } catch (error) {
      debugError('SERVICE:DISCOUNT:GET:ERROR', error)
      return null
    }
  },
  getMany: async ({ body }: GetManyServiceInput): GetManyServiceOutput => {
    try {
      const conditions = []
      if (body?.isActive !== undefined) conditions.push(eq(discount.isActive, Boolean(body.isActive)))

      const data = await db.query.discount.findMany({
        where: conditions.length ? and(...conditions) : undefined,
        limit: body?.limit ?? 50,
        offset: body?.offset ?? 0,
      })

      return data
    } catch (error) {
      debugError('SERVICE:DISCOUNT:GET_MANY:ERROR', error)
      return null
    }
  },
  validateCode: async ({ params }: ValidateCodeServiceInput): ValidateCodeServiceOutput => {
    try {
      const data = await db.query.discount.findFirst({
        where: (d, { eq, and, gt }) => {
          const conditions = [eq(d.code, String(params.code)), eq(d.isActive, true)]
          return and(...conditions)
        },
      })
      // Check if expired
      if (data && data.expiresAt && new Date(data.expiresAt) < new Date()) {
        return null
      }
      return data ?? null
    } catch (error) {
      debugError('SERVICE:DISCOUNT:VALIDATE_CODE:ERROR', error)
      return null
    }
  },
  create: async ({ body }: CreateServiceInput): CreateServiceOutput => {
    try {
      const [data] = await db
        .insert(discount)
        .values({
          id: uuidv4(),
          code: body.code ?? null,
          type: body.type,
          value: body.value ?? null,
          expiresAt: body.expiresAt ?? null,
          isActive: body.isActive ?? true,
        })
        .returning()

      return data
    } catch (error) {
      debugError('SERVICE:DISCOUNT:CREATE:ERROR', error)
      return null
    }
  },
  update: async ({ body, params }: UpdateServiceInput): UpdateServiceOutput => {
    try {
      const [data] = await db
        .update(discount)
        .set({
          code: body.code ?? undefined,
          type: body.type ?? undefined,
          value: body.value ?? undefined,
          expiresAt: body.expiresAt ?? undefined,
          isActive: body.isActive ?? undefined,
        })
        .where(eq(discount.id, String(params.id)))
        .returning()

      return data
    } catch (error) {
      debugError('SERVICE:DISCOUNT:UPDATE:ERROR', error)
      return null
    }
  },
  delete: async ({ params }: DeleteServiceInput): DeleteServiceOutput => {
    try {
      const [deleted] = await db
        .delete(discount)
        .where(eq(discount.id, String(params.id)))
        .returning({ id: discount.id })
      return deleted
    } catch (error) {
      debugError('SERVICE:DISCOUNT:DELETE:ERROR', error)
      return null
    }
  },
}
