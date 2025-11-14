import { subcategoryContract } from './subcategory.schema'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/core/api/api.methods'
import { STATUS, MESSAGE } from '@/shared/config/api.config'
import { API_RESPONSE } from '@/shared/config/api.utils'
import { db } from '@/core/db/db'
import { subcategory } from '@/core/db/schema'
import { eq, and, ilike } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'

export const subcategoryRouter = createTRPCRouter({
  get: publicProcedure
    .input(subcategoryContract.get.input)
    .output(subcategoryContract.get.output)
    .query(async ({ input }) => {
      try {
        const output =
          (await db.query.subcategory.findFirst({
            where: (s, { eq }) => {
              if (input.params?.id) return eq(s.id, String(input.params.id))
              if (input.params?.slug) return eq(s.slug, String(input.params.slug))
              return undefined
            },
          })) ?? null

        return API_RESPONSE(
          output ? STATUS.SUCCESS : STATUS.FAILED,
          output ? MESSAGE.SUBCATEGORY.GET.SUCCESS : MESSAGE.SUBCATEGORY.GET.FAILED,
          output,
        )
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.SUBCATEGORY.GET.ERROR, null, err as Error)
      }
    }),

  getMany: publicProcedure
    .input(subcategoryContract.getMany.input)
    .output(subcategoryContract.getMany.output)
    .query(async ({ input }) => {
      try {
        const conditions = []
        if (input.query?.search) conditions.push(ilike(subcategory.title, `%${input.query.search}%`))
        if (input.query?.visibility) conditions.push(eq(subcategory.visibility, input.query.visibility))
        if (input.query?.isFeatured !== undefined) conditions.push(eq(subcategory.isFeatured, input.query.isFeatured))
        if (input.query?.categorySlug) conditions.push(eq(subcategory.categorySlug, input.query.categorySlug))

        const output = await db.query.subcategory.findMany({
          where: conditions.length ? and(...conditions) : undefined,
          limit: input.query?.limit ?? 50,
          offset: input.query?.offset ?? 0,
          orderBy: (s, { asc }) => [asc(s.displayOrder)],
        })

        return API_RESPONSE(
          output?.length ? STATUS.SUCCESS : STATUS.FAILED,
          output?.length ? MESSAGE.SUBCATEGORY.GET_MANY.SUCCESS : MESSAGE.SUBCATEGORY.GET_MANY.FAILED,
          output ?? [],
        )
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.SUBCATEGORY.GET_MANY.ERROR, [], err as Error)
      }
    }),

  getBySlug: publicProcedure
    .input(subcategoryContract.getBySlug.input)
    .output(subcategoryContract.getBySlug.output)
    .query(async ({ input }) => {
      try {
        const { slug, categorySlug } = input.params
        if (!slug || !categorySlug) return API_RESPONSE(STATUS.FAILED, MESSAGE.SUBCATEGORY.GET_BY_SLUG.FAILED, null)

        const subcategoryData = await db.query.subcategory.findFirst({
          where: (s, { eq, and }) => and(eq(s.slug, slug), eq(s.categorySlug, categorySlug)),
        })

        if (!subcategoryData) return API_RESPONSE(STATUS.FAILED, MESSAGE.SUBCATEGORY.GET_BY_SLUG.FAILED, null)

        const seriesData = await db.query.series.findMany({
          where: (sr, { eq }) => eq(sr.subcategorySlug, subcategoryData.slug),
        })

        return API_RESPONSE(STATUS.SUCCESS, MESSAGE.SUBCATEGORY.GET_BY_SLUG.SUCCESS, { subcategoryData, seriesData })
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.SUBCATEGORY.GET_BY_SLUG.ERROR, null, err as Error)
      }
    }),

  create: protectedProcedure
    .input(subcategoryContract.create.input)
    .output(subcategoryContract.create.output)
    .mutation(async ({ input }) => {
      try {
        const [output] = await db
          .insert(subcategory)
          .values({
            id: uuidv4(),
            categorySlug: input.body.categorySlug,
            slug: input.body.slug ?? input.body.title.toLowerCase().replace(/\s+/g, '-'),
            title: input.body.title,
            description: input.body.description ?? null,
            icon: input.body.icon ?? null,
            color: input.body.color ?? null,
            displayType: input.body.displayType ?? 'grid',
            visibility: input.body.visibility ?? 'public',
            displayOrder: input.body.displayOrder ?? 0,
            image: input.body.image ?? null,
            isFeatured: input.body.isFeatured ?? false,
            metaTitle: input.body.metaTitle ?? null,
            metaDescription: input.body.metaDescription ?? null,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning()

        return API_RESPONSE(
          output ? STATUS.SUCCESS : STATUS.FAILED,
          output ? MESSAGE.SUBCATEGORY.CREATE.SUCCESS : MESSAGE.SUBCATEGORY.CREATE.FAILED,
          output,
        )
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.SUBCATEGORY.CREATE.ERROR, null, err as Error)
      }
    }),

  update: protectedProcedure
    .input(subcategoryContract.update.input)
    .output(subcategoryContract.update.output)
    .mutation(async ({ input }) => {
      try {
        const [output] = await db
          .update(subcategory)
          .set({
            title: input.body.title ?? undefined,
            slug: input.body.slug ?? undefined,
            description: input.body.description ?? undefined,
            icon: input.body.icon ?? undefined,
            color: input.body.color ?? undefined,
            displayType: input.body.displayType ?? undefined,
            visibility: input.body.visibility ?? undefined,
            displayOrder: input.body.displayOrder ?? undefined,
            image: input.body.image ?? undefined,
            isFeatured: input.body.isFeatured ?? undefined,
            metaTitle: input.body.metaTitle ?? undefined,
            metaDescription: input.body.metaDescription ?? undefined,
            updatedAt: new Date(),
          })
          .where(eq(subcategory.id, String(input.params.id)))
          .returning()

        return API_RESPONSE(
          output ? STATUS.SUCCESS : STATUS.FAILED,
          output ? MESSAGE.SUBCATEGORY.UPDATE.SUCCESS : MESSAGE.SUBCATEGORY.UPDATE.FAILED,
          output,
        )
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.SUBCATEGORY.UPDATE.ERROR, null, err as Error)
      }
    }),

  delete: protectedProcedure
    .input(subcategoryContract.delete.input)
    .output(subcategoryContract.delete.output)
    .mutation(async ({ input }) => {
      try {
        const [output] = await db
          .update(subcategory)
          .set({ deletedAt: new Date() })
          .where(eq(subcategory.id, String(input.params.id)))
          .returning({ id: subcategory.id })

        return API_RESPONSE(
          output ? STATUS.SUCCESS : STATUS.FAILED,
          output ? MESSAGE.SUBCATEGORY.DELETE.SUCCESS : MESSAGE.SUBCATEGORY.DELETE.FAILED,
          output,
        )
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.SUBCATEGORY.DELETE.ERROR, null, err as Error)
      }
    }),

  search: protectedProcedure
    .input(subcategoryContract.search.input)
    .output(subcategoryContract.search.output)
    .query(async ({ input }) => {
      try {
        const output = await db.query.subcategory.findMany({
          where: ilike(subcategory.title, `%${input.query.q}%`),
          limit: input.query.limit ?? 10,
          orderBy: (s, { asc }) => [asc(s.displayOrder)],
        })

        return API_RESPONSE(
          output?.length ? STATUS.SUCCESS : STATUS.FAILED,
          output?.length ? MESSAGE.SUBCATEGORY.SEARCH.SUCCESS : MESSAGE.SUBCATEGORY.SEARCH.FAILED,
          output ?? [],
        )
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.SUBCATEGORY.SEARCH.ERROR, [], err as Error)
      }
    }),
})
