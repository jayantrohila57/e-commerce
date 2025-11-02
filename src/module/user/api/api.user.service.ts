import {
  type CreateServiceInput,
  type CreateServiceOutput,
  type DeleteServiceInput,
  type DeleteServiceOutput,
  type GetManyServiceInput,
  type GetManyServiceOutput,
  type GetServiceInput,
  type GetServiceOutput,
  type UpdateServiceInput,
  type UpdateServiceOutput,
} from '../dto/types.user'

import { debugError } from '@/shared/utils/lib/logger.utils'
import { db } from '@/core/db/db'
import { eq, and, ilike } from 'drizzle-orm'
import { user } from '@/core/db/schema'
import { v4 as uuidv4 } from 'uuid'

export const userService = {
  get: async ({ body, params }: GetServiceInput): GetServiceOutput => {
    try {
      const data = await db.query.user.findFirst({
        where: (u, { eq }) => {
          if (params?.id) return eq(u.id, String(params?.id))
          if (body?.email) return eq(u.email, String(body?.email))
          return undefined
        },
      })
      return data ?? null
    } catch (error) {
      debugError('SERVICE:USER:GET:ERROR', error)
      return null
    }
  },
  getMany: async ({ body }: GetManyServiceInput): GetManyServiceOutput => {
    try {
      const conditions = []
      if (body?.search) conditions.push(ilike(user.name, `%${body.search}%`))
      if (body?.role) conditions.push(eq(user.role, String(body.role)))
      if (body?.banned !== undefined) conditions.push(eq(user.banned, Boolean(body.banned)))

      const data = await db.query.user.findMany({
        where: conditions.length ? and(...conditions) : undefined,
        orderBy: (u, { desc }) => desc(u.createdAt),
        limit: body?.limit ?? 50,
        offset: body?.offset ?? 0,
      })

      return data
    } catch (error) {
      debugError('SERVICE:USER:GET_MANY:ERROR', error)
      return null
    }
  },
  create: async ({ body }: CreateServiceInput): CreateServiceOutput => {
    try {
      const [data] = await db
        .insert(user)
        .values({
          id: uuidv4(),
          name: body.name,
          email: body.email,
          emailVerified: body.emailVerified ?? false,
          image: body.image ?? null,
          twoFactorEnabled: body.twoFactorEnabled ?? false,
          role: body.role ?? 'user',
          banned: body.banned ?? false,
          banReason: body.banReason ?? undefined,
          banExpires: body.banExpires ?? undefined,
        })
        .returning()

      return data
    } catch (error) {
      debugError('SERVICE:USER:CREATE:ERROR', error)
      return null
    }
  },
  update: async ({ body, params }: UpdateServiceInput): UpdateServiceOutput => {
    try {
      const [data] = await db
        .update(user)
        .set({
          name: body.name,
          email: body.email,
          emailVerified: body.emailVerified ?? false,
          image: body.image ?? null,
          twoFactorEnabled: body.twoFactorEnabled ?? false,
          role: body.role ?? 'user',
          banned: body.banned ?? false,
          banReason: body.banReason ?? undefined,
          banExpires: body.banExpires ?? undefined,
          updatedAt: new Date(),
        })
        .where(eq(user.id, String(params.id)))
        .returning()

      return data
    } catch (error) {
      debugError('SERVICE:USER:UPDATE:ERROR', error)
      return null
    }
  },
  delete: async ({ params }: DeleteServiceInput): DeleteServiceOutput => {
    try {
      const [deleted] = await db
        .delete(user)
        .where(eq(user.id, String(params.id)))
        .returning({ id: user.id })
      return deleted
    } catch (error) {
      debugError('SERVICE:USER:DELETE:ERROR', error)
      return null
    }
  },
}
