import {
  type CreateServiceInput,
  type CreateServiceOutput,
  type DeleteServiceInput,
  type DeleteServiceOutput,
  type GetManyServiceInput,
  type GetManyServiceOutput,
  type GetServiceInput,
  type GetServiceOutput,
  type GetBySlugServiceInput,
  type GetBySlugServiceOutput,
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
} from './types.subcategory'

import { debugError } from '@/shared/utils/lib/logger.utils'
import { db } from '@/core/db/db'
import { eq, and, ilike, inArray } from 'drizzle-orm'
import { subcategory } from '@/core/db/schema'
import { v4 as uuidv4 } from 'uuid'

export const subcategoryService = {
  get: async ({ params }: GetServiceInput): GetServiceOutput => {
    try {
      return (
        (await db.query.subcategory.findFirst({
          where: (s, { eq }) => {
            if (params?.id) return eq(s.id, String(params.id))
            if (params?.slug) return eq(s.slug, String(params.slug))
            return undefined
          },
        })) ?? null
      )
    } catch (error) {
      debugError('SERVICE:SUBCATEGORY:GET:ERROR', error)
      return null
    }
  },

  getBySlug: async ({ params }: GetBySlugServiceInput): GetBySlugServiceOutput => {
    try {
      const { slug, categorySlug } = params
      if (!slug || !categorySlug) return null
      const subcategoryData = await db.query.subcategory.findFirst({
        where: (s, { eq, and }) => and(eq(s.slug, slug), eq(s.categorySlug, categorySlug)),
      })
      if (!subcategoryData) return null

      const seriesData = await db.query.series.findMany({
        where: (sr, { eq, and }) => and(eq(sr.subcategorySlug, subcategoryData.slug)),
      })
      return {
        subcategoryData,
        seriesData,
      }
    } catch (error) {
      debugError('SERVICE:SUBCATEGORY:GET_BY_SLUG:ERROR', error)
      return null
    }
  },

  getMany: async ({ query }: GetManyServiceInput): GetManyServiceOutput => {
    try {
      const conditions = []
      if (query?.search) conditions.push(ilike(subcategory.title, `%${query.search}%`))
      if (query?.visibility) conditions.push(eq(subcategory.visibility, query.visibility))
      if (query?.isFeatured !== undefined) conditions.push(eq(subcategory.isFeatured, query.isFeatured))
      if (query?.categorySlug) conditions.push(eq(subcategory.categorySlug, query.categorySlug))

      const data = await db.query.subcategory.findMany({
        where: conditions.length ? and(...conditions) : undefined,
        limit: query?.limit ?? 50,
        offset: query?.offset ?? 0,
        orderBy: (s, { asc }) => [asc(s.displayOrder)],
      })

      return data
    } catch (error) {
      debugError('SERVICE:SUBCATEGORY:GET_MANY:ERROR', error)
      return null
    }
  },

  create: async ({ body }: CreateServiceInput): CreateServiceOutput => {
    try {
      const [data] = await db
        .insert(subcategory)
        .values({
          id: uuidv4(),
          categorySlug: body.categorySlug,
          slug: body.slug ?? body.title.toLowerCase().replace(/\s+/g, '-'),
          title: body.title,
          description: body.description ?? null,
          icon: body.icon ?? null,
          color: body.color ?? null,
          displayType: body.displayType ?? 'grid',
          visibility: body.visibility ?? 'public',
          displayOrder: body.displayOrder ?? 0,
          image: body.image ?? null,
          isFeatured: body.isFeatured ?? false,
          metaTitle: body.metaTitle ?? null,
          metaDescription: body.metaDescription ?? null,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning()

      return data
    } catch (error) {
      debugError('SERVICE:SUBCATEGORY:CREATE:ERROR', error)
      return null
    }
  },

  update: async ({ body, params }: UpdateServiceInput): UpdateServiceOutput => {
    try {
      const [data] = await db
        .update(subcategory)
        .set({
          title: body.title ?? undefined,
          slug: body.slug ?? undefined,
          description: body.description ?? undefined,
          icon: body.icon ?? undefined,
          color: body.color ?? undefined,
          displayType: body.displayType ?? undefined,
          visibility: body.visibility ?? undefined,
          displayOrder: body.displayOrder ?? undefined,
          image: body.image ?? undefined,
          isFeatured: body.isFeatured ?? undefined,
          metaTitle: body.metaTitle ?? undefined,
          metaDescription: body.metaDescription ?? undefined,
          updatedAt: new Date(),
        })
        .where(eq(subcategory.id, String(params.id)))
        .returning()

      return data
    } catch (error) {
      debugError('SERVICE:SUBCATEGORY:UPDATE:ERROR', error)
      return null
    }
  },

  delete: async ({ params }: DeleteServiceInput): DeleteServiceOutput => {
    try {
      const [deleted] = await db
        .update(subcategory)
        .set({ deletedAt: new Date() })
        .where(eq(subcategory.id, String(params.id)))
        .returning({ id: subcategory.id })
      return deleted
    } catch (error) {
      debugError('SERVICE:SUBCATEGORY:DELETE:ERROR', error)
      return null
    }
  },

  restore: async ({ params }: RestoreServiceInput): RestoreServiceOutput => {
    try {
      const [restored] = await db
        .update(subcategory)
        .set({ deletedAt: null })
        .where(eq(subcategory.id, String(params.id)))
        .returning()
      return restored
    } catch (error) {
      debugError('SERVICE:SUBCATEGORY:RESTORE:ERROR', error)
      return null
    }
  },

  toggleVisibility: async ({ params, body }: ToggleVisibilityServiceInput): ToggleVisibilityServiceOutput => {
    try {
      const [updated] = await db
        .update(subcategory)
        .set({
          visibility: body.visibility,
          updatedAt: new Date(),
        })
        .where(eq(subcategory.id, String(params.id)))
        .returning()
      return updated
    } catch (error) {
      debugError('SERVICE:SUBCATEGORY:TOGGLE_VISIBILITY:ERROR', error)
      return null
    }
  },

  toggleFeatured: async ({ params, body }: ToggleFeaturedServiceInput): ToggleFeaturedServiceOutput => {
    try {
      const [updated] = await db
        .update(subcategory)
        .set({
          isFeatured: body.isFeatured,
          updatedAt: new Date(),
        })
        .where(eq(subcategory.id, String(params.id)))
        .returning()
      return updated
    } catch (error) {
      debugError('SERVICE:SUBCATEGORY:TOGGLE_FEATURED:ERROR', error)
      return null
    }
  },

  reorder: async ({ body }: ReorderServiceInput): ReorderServiceOutput => {
    try {
      const updatedIds: string[] = []
      for (const item of body) {
        const [updated] = await db
          .update(subcategory)
          .set({
            displayOrder: item.displayOrder,
            updatedAt: new Date(),
          })
          .where(eq(subcategory.id, item.id))
          .returning({ id: subcategory.id })
        if (updated?.id) updatedIds.push(updated.id)
      }

      const reordered = await db.query.subcategory.findMany({
        where: inArray(subcategory.id, updatedIds),
      })
      return reordered
    } catch (error) {
      debugError('SERVICE:SUBCATEGORY:REORDER:ERROR', error)
      return null
    }
  },

  search: async ({ query }: SearchServiceInput): SearchServiceOutput => {
    try {
      const data = await db.query.subcategory.findMany({
        where: ilike(subcategory.title, `%${query.q}%`),
        limit: query.limit ?? 10,
        orderBy: (s, { asc }) => [asc(s.displayOrder)],
      })
      return data
    } catch (error) {
      debugError('SERVICE:SUBCATEGORY:SEARCH:ERROR', error)
      return null
    }
  },
}
