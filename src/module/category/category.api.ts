import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/core/api/api.methods'
import { db } from '@/core/db/db'
import { category, subcategory, series } from '@/core/db/db.schema'
import { MESSAGE, STATUS } from '@/shared/config/api.config'
import { API_RESPONSE } from '@/shared/config/api.utils'
import { debugError } from '@/shared/utils/lib/logger.utils'
import { and, eq, ilike, isNull } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { categoryContract } from './category.schema'

export const categoryRouter = createTRPCRouter({
  get: publicProcedure
    .input(categoryContract.get.input)
    .output(categoryContract.get.output)
    .query(async ({ input }) => {
      try {
        const output = await db.query.category.findFirst({
          where: (c, { eq }) => {
            if (input.params?.id) return eq(c.id, String(input.params.id))
            if (input.params?.slug) return eq(c.slug, String(input.params.slug))
            return undefined
          },
        })
        return API_RESPONSE(
          output ? STATUS.SUCCESS : STATUS.FAILED,
          output ? MESSAGE.CATEGORY.GET.SUCCESS : MESSAGE.CATEGORY.GET.FAILED,
          output ?? null,
        )
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.CATEGORY.GET.ERROR, null, err as Error)
      }
    }),

  getMany: publicProcedure
    .input(categoryContract.getMany.input)
    .output(categoryContract.getMany.output)
    .query(async ({ input }) => {
      try {
        const conditions = []
        if (input.query?.search) conditions.push(ilike(category.title, `%${input.query.search}%`))
        if (input.query?.visibility) conditions.push(eq(category.visibility, input.query.visibility))
        if (input.query?.isFeatured !== undefined) conditions.push(eq(category.isFeatured, input.query.isFeatured))
        const output = await db.query.category.findMany({
          where: conditions.length ? and(...conditions) : undefined,
          limit: input.query?.limit ?? 50,
          offset: input.query?.offset ?? 0,
          orderBy: (c, { asc }) => [asc(c.displayOrder)],
        })
        return API_RESPONSE(
          output?.length ? STATUS.SUCCESS : STATUS.FAILED,
          output?.length ? MESSAGE.CATEGORY.GET_MANY.SUCCESS : MESSAGE.CATEGORY.GET_MANY.FAILED,
          output,
        )
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.CATEGORY.GET_MANY.ERROR, null, err as Error)
      }
    }),
  getAllFeaturedCategories: publicProcedure
    .input(categoryContract.getAllFeaturedCategories.input)
    .output(categoryContract.getAllFeaturedCategories.output)
    .query(async () => {
      try {
        const output = await db.query.category.findMany({
          where: (c, { eq, and, isNull }) => and(eq(c.isFeatured, true), isNull(c.deletedAt)),
          orderBy: (c, { asc }) => [asc(c.displayOrder)],
        })

        return API_RESPONSE(
          output?.length ? STATUS.SUCCESS : STATUS.FAILED,
          output?.length ? MESSAGE.CATEGORY.GET_ALL_FEATURED.SUCCESS : MESSAGE.CATEGORY.GET_ALL_FEATURED.FAILED,
          output,
        )
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.CATEGORY.GET_ALL_FEATURED.ERROR, null, err as Error)
      }
    }),

  getManyWithSubcategories: publicProcedure
    .input(categoryContract.getManyWithSubcategories.input)
    .output(categoryContract.getManyWithSubcategories.output)
    .query(async ({ input }) => {
      try {
        const conditions = []
        if (input.query?.search) conditions.push(ilike(category.title, `%${input.query.search}%`))
        if (input.query?.visibility) conditions.push(eq(category.visibility, input.query.visibility))
        if (input.query?.isFeatured !== undefined) conditions.push(eq(category.isFeatured, input.query.isFeatured))
        const output = await db.query.category.findMany({
          where: conditions.length ? and(...conditions) : undefined,
          limit: input.query?.limit ?? 50,
          offset: input.query?.offset ?? 0,
          orderBy: (c, { asc }) => [asc(c.displayOrder)],
          with: {
            subcategories: {
              limit: 4,
              orderBy: (sc, { asc }) => [asc(sc.displayOrder)],
            },
          },
        })

        return API_RESPONSE(
          output?.length ? STATUS.SUCCESS : STATUS.FAILED,
          output?.length
            ? MESSAGE.CATEGORY.GET_MANY_WITH_SUBCATEGORIES.SUCCESS
            : MESSAGE.CATEGORY.GET_MANY_WITH_SUBCATEGORIES.FAILED,
          output,
        )
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.CATEGORY.GET_MANY_WITH_SUBCATEGORIES.ERROR, null, err as Error)
      }
    }),

  getManyByTypes: publicProcedure
    .input(categoryContract.getManyByTypes.input)
    .output(categoryContract.getManyByTypes.output)
    .query(async () => {
      try {
        const featuredCategories = await db.query.category.findMany({
          where: (c, { eq, and, isNull }) => and(eq(c.isFeatured, true), isNull(c.deletedAt)),
        })
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
        const recentCategories = await db.query.category.findMany({
          where: (c, { and, isNull }) => and(isNull(c.deletedAt)),
          limit: 10,
        })

        // Get soft-deleted categories
        const deletedCategories = await db.query.category.findMany({
          where: (c, { and, not, isNull }) => and(not(isNull(c.deletedAt))),
        })
        const output = {
          featuredCategoryType: featuredCategories,
          categoryVisibility: {
            publicCategoryType: publicCategories,
            privateCategoryType: privateCategories,
            hiddenCategoryType: hiddenCategories,
          },
          recentCategoryType: recentCategories,
          deletedCategoryType: deletedCategories,
        }
        return API_RESPONSE(
          output ? STATUS.SUCCESS : STATUS.FAILED,
          output ? MESSAGE.CATEGORY.GET_MANY.SUCCESS : MESSAGE.CATEGORY.GET_MANY.FAILED,
          output,
        )
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.CATEGORY.GET_MANY.ERROR, null, err as Error)
      }
    }),

  getCategoryWithSubCategories: publicProcedure
    .input(categoryContract.getCategoryWithSubCategories.input)
    .output(categoryContract.getCategoryWithSubCategories.output)
    .query(async ({ input }) => {
      try {
        const responseData = await db.query.category.findFirst({
          where: (c, { eq }) => eq(c.slug, input.params.slug),
          with: {
            subcategories: {
              orderBy: (s, { asc }) => [asc(s.displayOrder)],
            },
          },
        })

        if (!responseData) return API_RESPONSE(STATUS.FAILED, MESSAGE.CATEGORY.GET_BY_SLUG.FAILED, null)

        return API_RESPONSE(STATUS.SUCCESS, MESSAGE.CATEGORY.GET_BY_SLUG.SUCCESS, responseData)
      } catch (err) {
        debugError('CATEGORY:GET_BY_SLUG:ERROR', err)
        return API_RESPONSE(STATUS.ERROR, MESSAGE.CATEGORY.GET_BY_SLUG.ERROR, null, err as Error)
      }
    }),

  create: protectedProcedure
    .input(categoryContract.create.input)
    .output(categoryContract.create.output)
    .mutation(async ({ input }) => {
      try {
        const [output] = await await db
          .insert(category)
          .values({
            id: uuidv4(),
            slug: input.body.slug ?? input.body.title.toLowerCase().replace(/\s+/g, '-'),
            title: input.body.title,
            description: input.body.description ?? null,
            color: input.body.color ?? null,
            displayType: input.body.displayType ?? 'grid',
            visibility: input.body.visibility ?? 'public',
            displayOrder: input.body.displayOrder ?? 0,
            image: input.body.image ?? null,
            isFeatured: input.body.isFeatured ?? false,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning()
        return API_RESPONSE(
          output ? STATUS.SUCCESS : STATUS.FAILED,
          output ? MESSAGE.CATEGORY.CREATE.SUCCESS : MESSAGE.CATEGORY.CREATE.FAILED,
          output,
        )
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.CATEGORY.CREATE.ERROR, null, err as Error)
      }
    }),

  update: protectedProcedure
    .input(categoryContract.update.input)
    .output(categoryContract.update.output)
    .mutation(async ({ input }) => {
      try {
        const { params, body } = input

        // Check if category exists
        const existingCategory = await db.query.category.findFirst({
          where: eq(category.id, params.id),
        })

        if (!existingCategory) {
          return API_RESPONSE(STATUS.FAILED, 'Category not found', null)
        }

        // Check for duplicate slug if it's being updated
        if (body.slug && body.slug !== existingCategory.slug) {
          const existingSlug = await db.query.category.findFirst({
            where: and(eq(category.slug, body.slug), eq(category.id, params.id)),
          })

          if (existingSlug) {
            return API_RESPONSE(STATUS.FAILED, 'A category with this slug already exists', null)
          }
        }

        // Prepare update data
        const updateData = {
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

        // Perform the update
        const [updatedCategory] = await db
          .update(category)
          .set(updateData)
          .where(eq(category.id, params.id))
          .returning()

        if (!updatedCategory) {
          return API_RESPONSE(STATUS.FAILED, MESSAGE.CATEGORY.UPDATE.FAILED, null)
        }

        return API_RESPONSE(STATUS.SUCCESS, MESSAGE.CATEGORY.UPDATE.SUCCESS, updatedCategory)
      } catch (err) {
        debugError('CATEGORY:UPDATE:ERROR', err)
        return API_RESPONSE(STATUS.ERROR, MESSAGE.CATEGORY.UPDATE.ERROR, null, err as Error)
      }
    }),

  delete: protectedProcedure
    .input(categoryContract.delete.input)
    .output(categoryContract.delete.output)
    .mutation(async ({ input }) => {
      try {
        const [output] = await db
          .update(category)
          .set({ deletedAt: new Date() })
          .where(eq(category.id, String(input.params.id)))
          .returning({ id: category.id })
        return API_RESPONSE(
          output ? STATUS.SUCCESS : STATUS.FAILED,
          output ? MESSAGE.CATEGORY.DELETE.SUCCESS : MESSAGE.CATEGORY.DELETE.FAILED,
          output,
        )
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.CATEGORY.DELETE.ERROR, null, err as Error)
      }
    }),

  getNestedHierarchy: publicProcedure
    .input(categoryContract.getNestedHierarchy.input)
    .output(categoryContract.getNestedHierarchy.output)
    .query(async ({ input }) => {
      try {
        const conditions = []
        if (input.query?.search) conditions.push(ilike(category.title, `%${input.query.search}%`))
        if (input.query?.visibility) conditions.push(eq(category.visibility, input.query.visibility))
        if (input.query?.isFeatured !== undefined) conditions.push(eq(category.isFeatured, input.query.isFeatured))

        // Filter out deleted categories
        conditions.push(isNull(category.deletedAt))

        const output = await db.query.category.findMany({
          where: conditions.length ? and(...conditions) : isNull(category.deletedAt),
          limit: input.query?.limit ?? 50,
          offset: input.query?.offset ?? 0,
          orderBy: (c, { asc }) => [asc(c.displayOrder)],
          with: {
            subcategories: {
              where: isNull(subcategory.deletedAt),
              orderBy: (sc, { asc }) => [asc(sc.displayOrder)],
              with: {
                series: {
                  where: isNull(series.deletedAt),
                  orderBy: (s, { asc }) => [asc(s.displayOrder)],
                },
              },
            },
          },
        })

        return API_RESPONSE(
          output?.length ? STATUS.SUCCESS : STATUS.FAILED,
          output?.length ? MESSAGE.CATEGORY.GET_MANY.SUCCESS : MESSAGE.CATEGORY.GET_MANY.FAILED,
          output,
        )
      } catch (err) {
        debugError('CATEGORY:GET_NESTED_HIERARCHY:ERROR', err)
        return API_RESPONSE(STATUS.ERROR, MESSAGE.CATEGORY.GET_MANY.ERROR, null, err as Error)
      }
    }),
})
