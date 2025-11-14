import { debugError } from '@/shared/utils/lib/logger.utils'
import { db } from '@/core/db/db'
import { and, eq, ilike, inArray, isNull, sql } from 'drizzle-orm'
import { series } from '@/core/db/schema'
import { v4 as uuidv4 } from 'uuid'

import {
  type GetServiceInput,
  type GetServiceOutput,
  type GetBySlugServiceInput,
  type GetBySlugServiceOutput,
  type GetManyServiceInput,
  type GetManyServiceOutput,
  type CreateServiceInput,
  type CreateServiceOutput,
  type UpdateServiceInput,
  type UpdateServiceOutput,
  type DeleteServiceInput,
  type DeleteServiceOutput,
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
} from './types.series'

export const seriesService = {
  get: async ({ params }: GetServiceInput): GetServiceOutput => {
    try {
      const data =
        (await db.query.series.findFirst({
          where: (s, { eq, and }) => and(eq(s.id, params.id), isNull(s.deletedAt)),
        })) ?? null

      return data
    } catch (error) {
      debugError('SERVICE:SERIES:GET', error)
      return null
    }
  },

  getBySlug: async ({ params }: GetBySlugServiceInput): GetBySlugServiceOutput => {
    try {
      const { slug } = params
      if (!slug) return null

      const seriesData = await db.query.series.findFirst({
        where: (s, { eq, and }) => and(eq(s.slug, params.slug), isNull(s.deletedAt)),
      })

      const attributeData = await db.query.attribute.findMany({
        where: (at, { eq, and }) => and(eq(at.seriesSlug, String(seriesData?.slug)), isNull(at.deletedAt)),
      })

      return {
        seriesData: seriesData ?? null,
        attributeData: attributeData ?? [],
      }
    } catch (error) {
      debugError('SERVICE:SERIES:GET_BY_SLUG', error)
      return null
    }
  },

  getMany: async ({ query }: GetManyServiceInput): GetManyServiceOutput => {
    try {
      const filters = [isNull(series.deletedAt)]

      if (query?.search) filters.push(ilike(series.title, `%${query.search}%`))
      if (query?.subcategorySlug) filters.push(eq(series.subcategorySlug, query.subcategorySlug))

      const data = await db.query.series.findMany({
        where: and(...filters),
        limit: query?.limit ?? 20,
        offset: query?.offset ?? 0,
        orderBy: (s, { asc }) => [asc(s.displayOrder)],
      })

      return data
    } catch (error) {
      debugError('SERVICE:SERIES:GET_MANY', error)
      return null
    }
  },

  create: async ({ body }: CreateServiceInput): CreateServiceOutput => {
    try {
      const [data] = await db
        .insert(series)
        .values({
          id: uuidv4(),
          ...body,
          slug: body.slug ?? body.title.toLowerCase().replace(/\s+/g, '-'),
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning()

      return data ?? null
    } catch (error) {
      debugError('SERVICE:SERIES:CREATE', error)
      return null
    }
  },

  update: async ({ params, body }: UpdateServiceInput): UpdateServiceOutput => {
    try {
      const [data] = await db
        .update(series)
        .set({
          ...body,
          updatedAt: new Date(),
        })
        .where(eq(series.id, params.id))
        .returning()

      return data ?? null
    } catch (error) {
      debugError('SERVICE:SERIES:UPDATE', error)
      return null
    }
  },

  delete: async ({ params }: DeleteServiceInput): DeleteServiceOutput => {
    try {
      const [data] = await db
        .update(series)
        .set({
          deletedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(series.id, params.id))
        .returning({ id: series.id })

      return data ?? null
    } catch (error) {
      debugError('SERVICE:SERIES:DELETE', error)
      return null
    }
  },

  restore: async ({ params }: RestoreServiceInput): RestoreServiceOutput => {
    try {
      const [data] = await db
        .update(series)
        .set({
          deletedAt: null,
          updatedAt: new Date(),
        })
        .where(eq(series.id, params.id))
        .returning()

      return data ?? null
    } catch (error) {
      debugError('SERVICE:SERIES:RESTORE', error)
      return null
    }
  },

  toggleVisibility: async ({ params, body }: ToggleVisibilityServiceInput): ToggleVisibilityServiceOutput => {
    try {
      const [data] = await db
        .update(series)
        .set({
          ...body,
          updatedAt: new Date(),
        })
        .where(eq(series.id, params.id))
        .returning()

      return data ?? null
    } catch (error) {
      debugError('SERVICE:SERIES:TOGGLE_VISIBILITY', error)
      return null
    }
  },

  toggleFeatured: async ({ params, body }: ToggleFeaturedServiceInput): ToggleFeaturedServiceOutput => {
    try {
      const [data] = await db
        .update(series)
        .set({
          isFeatured: body.isFeatured,
          updatedAt: new Date(),
        })
        .where(eq(series.id, params.id))
        .returning()

      return data ?? null
    } catch (error) {
      debugError('SERVICE:SERIES:TOGGLE_FEATURED', error)
      return null
    }
  },

  reorder: async ({ body }: ReorderServiceInput): ReorderServiceOutput => {
    try {
      return await db.transaction(async (tx) => {
        const ids = body.map((i) => i.id)

        const exists = await tx
          .select({ count: sql<number>`count(*)` })
          .from(series)
          .where(inArray(series.id, ids))

        if (exists[0].count !== ids.length) throw new Error('Missing series')

        const updates = body.map((item) =>
          tx
            .update(series)
            .set({
              displayOrder: item.displayOrder,
              updatedAt: new Date(),
            })
            .where(eq(series.id, item.id))
            .returning(),
        )

        const result = await Promise.all(updates)
        return result.flat()
      })
    } catch (error) {
      debugError('SERVICE:SERIES:REORDER', error)
      return null
    }
  },
}
