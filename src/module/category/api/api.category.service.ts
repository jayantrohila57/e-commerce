import {
  type CreateServiceInput,
  type CreateServiceOutput,
  type DeleteServiceInput,
  type DeleteServiceOutput,
  type GetManyServiceInput,
  type GetManyServiceOutput,
  type GetManyByTypesServiceInput,
  type GetManyByTypesServiceOutput,
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
  type GetCategoryWithSubcategoriesServiceInput,
  type GetCategoryWithSubcategoriesServiceOutput,
} from '../dto/types.category'

import { debugError, debugLog } from '@/shared/utils/lib/logger.utils'
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

  getManyByTypes: async ({ query }: GetManyByTypesServiceInput): GetManyByTypesServiceOutput => {
    try {
      // Get featured categories
      const featuredCategories = await db.query.category.findMany({
        where: (c, { eq, and, isNull }) => and(eq(c.isFeatured, true), isNull(c.deletedAt)),
      })

      // Get categories by visibility
      const [publicCategories, privateCategories, hiddenCategories] = await Promise.all([
        db.query.category.findMany({
          where: (c, { eq, and, isNull }) => and(eq(c.visibility, 'public'), isNull(c.deletedAt)),
        }),
        db.query.category.findMany({
          where: (c, { eq, and, isNull }) => and(eq(c.visibility, 'private'), isNull(c.deletedAt)),
        }),
        db.query.category.findMany({
          where: (c, { eq, and, isNull }) => and(eq(c.visibility, 'hidden'), isNull(c.deletedAt)),
        }),
      ])

      // Get recent categories (last 10 created)
      const recentCategories = await db.query.category.findMany({
        where: (c, { and, isNull }) => and(isNull(c.deletedAt)),
        limit: 10,
      })

      // Get soft-deleted categories
      const deletedCategories = await db.query.category.findMany({
        where: (c, { and, not, isNull }) => and(not(isNull(c.deletedAt))),
      })

      return {
        featuredCategoryType: featuredCategories,
        categoryVisibility: {
          publicCategoryType: publicCategories,
          privateCategoryType: privateCategories,
          hiddenCategoryType: hiddenCategories,
        },
        recentCategoryType: recentCategories,
        deletedCategoryType: deletedCategories,
      }
    } catch (error) {
      debugError('SERVICE:CATEGORY:GET_MANY_BY_TYPES:ERROR', error)
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

  getBySlug: async ({
    params,
  }: GetCategoryWithSubcategoriesServiceInput): GetCategoryWithSubcategoriesServiceOutput => {
    try {
      const categoryData = await db.query.category.findFirst({
        where: (c, { eq }) => eq(c.slug, params.slug),
      })

      if (!categoryData) return null

      const subcategoriesData = await db.query.subcategory.findMany({
        where: (s, { eq }) => eq(s.categorySlug, categoryData.slug),
        orderBy: (s, { asc }) => [asc(s.displayOrder)],
      })

      return {
        category: categoryData,
        subcategories: subcategoriesData,
      }
    } catch (error) {
      debugError('SERVICE:CATEGORY_WITH_SUBCATEGORIES:GET_BY_SLUG:ERROR', error)
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
      const existingCategory = await db
        .select()
        .from(category)
        .where(eq(category.id, String(params.id)))
        .limit(1)
        .then((rows) => rows[0] || null)

      if (!existingCategory) {
        debugLog('SERVICE:CATEGORY:UPDATE:NOT_FOUND', { id: params.id })
        return null
      }

      if (body.slug && body.slug !== existingCategory.slug) {
        const existingSlug = await db
          .select()
          .from(category)
          .where(eq(category.slug, body.slug))
          .limit(1)
          .then((rows) => rows[0] || null)

        if (existingSlug) {
          return null
        }
      }

      const updateData: Record<string, any> = {
        title: body.title ?? existingCategory.title,
        slug: body.slug ?? existingCategory.slug,
        description: body.description ?? existingCategory.description,
        color: body.color ?? existingCategory.color,
        displayType: body.displayType ?? existingCategory.displayType,
        visibility: body.visibility ?? existingCategory.visibility,
        displayOrder: body.displayOrder ?? existingCategory.displayOrder,
        image: body.image ?? existingCategory.image,
        isFeatured: body.isFeatured ?? existingCategory.isFeatured,
        updatedAt: new Date(),
      }

      // Only include fields that were actually provided in the request
      const updatedFields = Object.keys(body).filter((key) => body[key as keyof typeof body] !== undefined)

      const [data] = await db
        .update(category)
        .set(updateData)
        .where(eq(category.id, String(params.id)))
        .returning()

      if (!data) {
        return null
      }

      debugLog('SERVICE:CATEGORY:UPDATE:SUCCESS', {
        id: params.id,
        updatedFields,
      })

      return data
    } catch (error) {
      debugError('SERVICE:CATEGORY:UPDATE:ERROR', {
        id: params.id,
        error: error instanceof Error ? error.message : String(error),
      })
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
