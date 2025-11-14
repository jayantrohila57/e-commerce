import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/core/api/api.methods'
import { debugError, debugLog } from '@/shared/utils/lib/logger.utils'
import { API_RESPONSE } from '@/shared/config/api.utils'
import { MESSAGE, STATUS } from '@/shared/config/api.config'

import { db } from '@/core/db/db'
import { product } from '@/core/db/schema'
import { eq, and, or, ilike, isNull } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { productContract } from './product.schema'
import { ProductUpdate } from './product.types'

export const productRouter = createTRPCRouter({
  get: publicProcedure
    .input(productContract.get.input)
    .output(productContract.get.output)
    .query(async ({ input }) => {
      try {
        const { id, slug } = input.params

        if (!id && !slug) {
          return API_RESPONSE(STATUS.FAILED, MESSAGE.PRODUCT.GET.FAILED, null)
        }

        const output = await db.query.product.findFirst({
          where: (p, { eq, and, isNull }) => {
            const conditions = []
            if (id) conditions.push(eq(p.id, String(id)))
            if (slug) conditions.push(eq(p.slug, String(slug)))
            conditions.push(isNull(p.deletedAt))
            return and(...conditions)
          },
        })

        return API_RESPONSE(
          output ? STATUS.SUCCESS : STATUS.FAILED,
          output ? MESSAGE.PRODUCT.GET.SUCCESS : MESSAGE.PRODUCT.GET.FAILED,
          output ?? null,
        )
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT.GET.ERROR, null, err as Error)
      }
    }),

  getMany: publicProcedure
    .input(productContract.getMany.input)
    .output(productContract.getMany.output)
    .query(async ({ input }) => {
      try {
        const { search, limit = 50, offset = 0, isFeatured, visibility } = input.query ?? {}

        const conditions = []

        if (search) {
          conditions.push(or(ilike(product.title, `%${search}%`), ilike(product.description, `%${search}%`)))
        }

        conditions.push(isNull(product.deletedAt))

        const output = await db.query.product.findMany({
          where: conditions.length ? and(...conditions) : undefined,
          limit: Math.min(limit, 100),
          offset,
          orderBy: (p, { desc }) => [desc(p.createdAt)],
        })

        return API_RESPONSE(
          output?.length ? STATUS.SUCCESS : STATUS.FAILED,
          output?.length ? MESSAGE.PRODUCT.GET_MANY.SUCCESS : MESSAGE.PRODUCT.GET_MANY.FAILED,
          output,
        )
      } catch (err) {
        debugError('PRODUCT:GET_MANY:ERROR', err)
        return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT.GET_MANY.ERROR, null, err as Error)
      }
    }),

  getBySlug: publicProcedure
    .input(productContract.getBySlug.input)
    .output(productContract.getBySlug.output)
    .query(async ({ input }) => {
      try {
        const { slug } = input.params

        const output = await db
          .select()
          .from(product)
          .where(and(eq(product.slug, slug), eq(product.isActive, true), isNull(product.deletedAt)))
          .limit(1)

        const row = output?.[0] ?? null

        return API_RESPONSE(
          row ? STATUS.SUCCESS : STATUS.FAILED,
          row ? MESSAGE.PRODUCT.GET_BY_SLUG.SUCCESS : MESSAGE.PRODUCT.GET_BY_SLUG.FAILED,
          row ? { product: row } : null,
        )
      } catch (err) {
        debugError('PRODUCT:GET_BY_SLUG:ERROR', err)
        return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT.GET_BY_SLUG.ERROR, null, err as Error)
      }
    }),

  create: protectedProcedure
    .input(productContract.create.input)
    .output(productContract.create.output)
    .mutation(async ({ input }) => {
      try {
        const now = new Date()

        const slug = input.body.slug ?? input.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')

        const [output] = await db
          .insert(product)
          .values({
            id: uuidv4(),
            title: input.body.title,
            description: input.body.description ?? null,
            metaTitle: input.body.metaTitle ?? null,
            metaDescription: input.body.metaDescription ?? null,
            slug,
            seriesSlug: input.body.seriesSlug,
            baseImage: input.body.baseImage ?? null,
            isActive: input.body.isActive ?? true,
            deletedAt: null,
            createdAt: now,
            updatedAt: now,
          })
          .returning()

        return API_RESPONSE(
          output ? STATUS.SUCCESS : STATUS.FAILED,
          output ? MESSAGE.PRODUCT.CREATE.SUCCESS : MESSAGE.PRODUCT.CREATE.FAILED,
          output,
        )
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT.CREATE.ERROR, null, err as Error)
      }
    }),

  update: protectedProcedure
    .input(productContract.update.input)
    .output(productContract.update.output)
    .mutation(async ({ input }) => {
      try {
        const { params, body } = input

        const [existingProduct] = await db
          .select()
          .from(product)
          .where(and(eq(product.id, params.id), isNull(product.deletedAt)))
          .limit(1)

        if (!existingProduct) {
          return API_RESPONSE(STATUS.FAILED, MESSAGE.PRODUCT.UPDATE.FAILED, null)
        }

        if (body.slug && body.slug !== existingProduct.slug) {
          const [existingSlug] = await db
            .select()
            .from(product)
            .where(and(eq(product.slug, body.slug), isNull(product.deletedAt)))
            .limit(1)

          if (existingSlug) {
            return API_RESPONSE(STATUS.FAILED, 'Slug already exists', null)
          }
        }

        const updateData: Partial<Pick<ProductUpdate, keyof ProductUpdate>> & { updatedAt: Date } = {
          updatedAt: new Date(),
        }

        for (const key in body) {
          if (key in updateData) {
            const value = body[key as keyof typeof body]
            if (value !== undefined) {
              ;(updateData as any)[key] = value
            }
          }
        }

        const [updatedProduct] = await db.update(product).set(updateData).where(eq(product.id, params.id)).returning()

        return API_RESPONSE(
          updatedProduct ? STATUS.SUCCESS : STATUS.FAILED,
          updatedProduct ? MESSAGE.PRODUCT.UPDATE.SUCCESS : MESSAGE.PRODUCT.UPDATE.FAILED,
          updatedProduct,
        )
      } catch (err) {
        debugError('PRODUCT:UPDATE:ERROR', err)
        return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT.UPDATE.ERROR, null, err as Error)
      }
    }),

  delete: protectedProcedure
    .input(productContract.delete.input)
    .output(productContract.delete.output)
    .mutation(async ({ input }) => {
      try {
        const [existing] = await db
          .select()
          .from(product)
          .where(and(eq(product.id, input.params.id), isNull(product.deletedAt)))
          .limit(1)

        if (!existing) {
          return API_RESPONSE(STATUS.FAILED, MESSAGE.PRODUCT.DELETE.FAILED, null)
        }

        const now = new Date()

        const [output] = await db
          .update(product)
          .set({
            deletedAt: now,
            updatedAt: now,
            slug: `${existing.slug}-deleted-${Date.now()}`,
            isActive: false,
          })
          .where(eq(product.id, input.params.id))
          .returning({ id: product.id })

        return API_RESPONSE(
          output ? STATUS.SUCCESS : STATUS.FAILED,
          output ? MESSAGE.PRODUCT.DELETE.SUCCESS : MESSAGE.PRODUCT.DELETE.FAILED,
          output,
        )
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT.DELETE.ERROR, null, err as Error)
      }
    }),

  search: protectedProcedure
    .input(productContract.search.input)
    .output(productContract.search.output)
    .query(async ({ input }) => {
      try {
        const output = await db.query.product.findMany({
          where: and(ilike(product.title, `%${input.query.q}%`), isNull(product.deletedAt)),
          limit: input.query.limit ?? 10,
          orderBy: (p, { asc }) => [asc(p.createdAt)],
        })

        return API_RESPONSE(
          output?.length ? STATUS.SUCCESS : STATUS.FAILED,
          output?.length ? MESSAGE.PRODUCT.SEARCH.SUCCESS : MESSAGE.PRODUCT.SEARCH.FAILED,
          output ?? [],
        )
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT.SEARCH.ERROR, [], err as Error)
      }
    }),
})
