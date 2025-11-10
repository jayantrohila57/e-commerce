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
  type RestoreServiceInput,
  type RestoreServiceOutput,
  type ToggleVisibilityServiceInput,
  type ToggleVisibilityServiceOutput,
  type ToggleFeaturedServiceInput,
  type ToggleFeaturedServiceOutput,
  type ReorderServiceInput,
  type ReorderServiceOutput,
  type SearchServiceInput,
  type SearchServiceOutput,
} from '../dto/types.category'

import { debugError } from '@/shared/utils/lib/logger.utils'
import { db } from '@/core/db/db'
import { eq, and, ilike, inArray } from 'drizzle-orm'
import { category } from '@/core/db/schema'
import { v4 as uuidv4 } from 'uuid'

export const categoryService = {
  get: async ({ params }: GetServiceInput): GetServiceOutput => {
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

  getMany: async ({ query }: GetManyServiceInput): GetManyServiceOutput => {
    try {
      const conditions = []
      if (query?.search) conditions.push(ilike(category.title, `%${query.search}%`))
      if (query?.visibility) conditions.push(eq(category.visibility, query.visibility))
      if (query?.isFeatured !== undefined) conditions.push(eq(category.isFeatured, query.isFeatured))

      const data = await db.query.category.findMany({
        where: conditions.length ? and(...conditions) : undefined,
        limit: query?.limit ?? 50,
        offset: query?.offset ?? 0,
        orderBy: (c, { asc }) => [asc(c.displayOrder)],
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
          slug: body.slug ?? body.title.toLowerCase().replace(/\s+/g, '-'),
          title: body.title,
          description: body.description ?? null,
          color: body.color ?? null,
          displayType: body.displayType ?? 'grid',
          visibility: body.visibility ?? 'public',
          displayOrder: body.displayOrder ?? 0,
          image: body.image ?? null,
          isFeatured: body.isFeatured ?? false,
          createdAt: new Date(),
          updatedAt: new Date(),
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
          title: body.title ?? undefined,
          slug: body.slug ?? undefined,
          description: body.description ?? undefined,
          color: body.color ?? undefined,
          displayType: body.displayType ?? undefined,
          visibility: body.visibility ?? undefined,
          displayOrder: body.displayOrder ?? undefined,
          image: body.image ?? undefined,
          isFeatured: body.isFeatured ?? undefined,
          updatedAt: new Date(),
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
        .update(category)
        .set({ deletedAt: new Date() })
        .where(eq(category.id, String(params.id)))
        .returning({ id: category.id })
      return deleted
    } catch (error) {
      debugError('SERVICE:CATEGORY:DELETE:ERROR', error)
      return null
    }
  },

  restore: async ({ params }: RestoreServiceInput): RestoreServiceOutput => {
    try {
      const [restored] = await db
        .update(category)
        .set({ deletedAt: null })
        .where(eq(category.id, String(params.id)))
        .returning()
      return restored
    } catch (error) {
      debugError('SERVICE:CATEGORY:RESTORE:ERROR', error)
      return null
    }
  },

  toggleVisibility: async ({ params, body }: ToggleVisibilityServiceInput): ToggleVisibilityServiceOutput => {
    try {
      const [updated] = await db
        .update(category)
        .set({
          visibility: body.visibility,
          updatedAt: new Date(),
        })
        .where(eq(category.id, String(params.id)))
        .returning()
      return updated
    } catch (error) {
      debugError('SERVICE:CATEGORY:TOGGLE_VISIBILITY:ERROR', error)
      return null
    }
  },

  toggleFeatured: async ({ params, body }: ToggleFeaturedServiceInput): ToggleFeaturedServiceOutput => {
    try {
      const [updated] = await db
        .update(category)
        .set({
          isFeatured: body.isFeatured,
          updatedAt: new Date(),
        })
        .where(eq(category.id, String(params.id)))
        .returning()
      return updated
    } catch (error) {
      debugError('SERVICE:CATEGORY:TOGGLE_FEATURED:ERROR', error)
      return null
    }
  },

  reorder: async ({ body }: ReorderServiceInput): ReorderServiceOutput => {
    try {
      const updatedIds: string[] = []
      for (const item of body) {
        const [updated] = await db
          .update(category)
          .set({
            displayOrder: item.displayOrder,
            updatedAt: new Date(),
          })
          .where(eq(category.id, item.id))
          .returning({ id: category.id })
        if (updated?.id) updatedIds.push(updated.id)
      }
      const reordered = await db.query.category.findMany({
        where: inArray(category.id, updatedIds),
      })
      return reordered
    } catch (error) {
      debugError('SERVICE:CATEGORY:REORDER:ERROR', error)
      return null
    }
  },

  search: async ({ query }: SearchServiceInput): SearchServiceOutput => {
    try {
      const data = await db.query.category.findMany({
        where: ilike(category.title, `%${query.q}%`),
        limit: query.limit ?? 10,
        orderBy: (c, { asc }) => [asc(c.displayOrder)],
      })
      return data
    } catch (error) {
      debugError('SERVICE:CATEGORY:SEARCH:ERROR', error)
      return null
    }
  },
}
