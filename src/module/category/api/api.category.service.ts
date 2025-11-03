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
} from '../dto/types.category'

import { debugError } from '@/shared/utils/lib/logger.utils'
import { db } from '@/core/db/db'
import { eq, and, ilike } from 'drizzle-orm'
import { category } from '@/core/db/schema'
import { v4 as uuidv4 } from 'uuid'

export const categoryService = {
  get: async ({ body, params }: GetServiceInput): GetServiceOutput => {
    try {
      const data = await db.query.category.findFirst({
        where: (c, { eq }) => {
          if (params?.id) return eq(c.id, String(params.id))
          if (params?.slug) return eq(c.slug, String(params.slug))
          return undefined
        },
      })
      return data ?? null
    } catch (error) {
      debugError('SERVICE:CATEGORY:GET:ERROR', error)
      return null
    }
  },
  getMany: async ({ body }: GetManyServiceInput): GetManyServiceOutput => {
    try {
      const conditions = []
      if (body?.search) conditions.push(ilike(category.name, `%${body.search}%`))

      const data = await db.query.category.findMany({
        where: conditions.length ? and(...conditions) : undefined,
        limit: body?.limit ?? 50,
        offset: body?.offset ?? 0,
      })

      return data
    } catch (error) {
      debugError('SERVICE:CATEGORY:GET_MANY:ERROR', error)
      return null
    }
  },
  create: async ({ body }: CreateServiceInput): CreateServiceOutput => {
    try {
      const [data] = await db
        .insert(category)
        .values({
          id: uuidv4(),
          name: body.name,
          slug: body.slug ?? null,
        })
        .returning()

      return data
    } catch (error) {
      debugError('SERVICE:CATEGORY:CREATE:ERROR', error)
      return null
    }
  },
  update: async ({ body, params }: UpdateServiceInput): UpdateServiceOutput => {
    try {
      const [data] = await db
        .update(category)
        .set({
          name: body.name ?? undefined,
          slug: body.slug ?? undefined,
        })
        .where(eq(category.id, String(params.id)))
        .returning()

      return data
    } catch (error) {
      debugError('SERVICE:CATEGORY:UPDATE:ERROR', error)
      return null
    }
  },
  delete: async ({ params }: DeleteServiceInput): DeleteServiceOutput => {
    try {
      const [deleted] = await db
        .delete(category)
        .where(eq(category.id, String(params.id)))
        .returning({ id: category.id })
      return deleted
    } catch (error) {
      debugError('SERVICE:CATEGORY:DELETE:ERROR', error)
      return null
    }
  },
}
