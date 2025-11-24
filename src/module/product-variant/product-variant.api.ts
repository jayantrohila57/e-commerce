// src/module/product-variant/product-variant.api.ts
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/core/api/api.methods'
import { MESSAGE, STATUS } from '@/shared/config/api.config'
import { API_RESPONSE } from '@/shared/config/api.utils'

import { db } from '@/core/db/db'
import { productVariant } from '@/core/db/db.schema'
import { and, eq, ilike, isNull } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { productVariantContract } from './product-variant.schema'

export const productVariantRouter = createTRPCRouter({
  // =========================
  // GET ONE
  // =========================
  get: publicProcedure
    .input(productVariantContract.get.input)
    .output(productVariantContract.get.output)
    .query(async ({ input }) => {
      try {
        const { slug } = input.params

        if (!slug) {
          return API_RESPONSE(STATUS.FAILED, MESSAGE.PRODUCT_VARIANT.GET.FAILED, null)
        }

        const output = await db.query.productVariant.findFirst({
          where: (pv, { eq, and, or, isNull }) => {
            const conditions = [isNull(pv.deletedAt)]
            if (slug) conditions.push(eq(pv.slug, slug))
            return and(...conditions)
          },
        })

        return API_RESPONSE(
          output ? STATUS.SUCCESS : STATUS.FAILED,
          output ? MESSAGE.PRODUCT_VARIANT.GET.SUCCESS : MESSAGE.PRODUCT_VARIANT.GET.FAILED,
          output ?? null,
        )
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT_VARIANT.GET.ERROR, null, err as Error)
      }
    }),

  // =========================
  // GET MANY
  // =========================
  getMany: publicProcedure
    .input(productVariantContract.getMany.input)
    .output(productVariantContract.getMany.output)
    .query(async ({ input }) => {
      try {
        const { query } = input
        const limit = query?.limit ?? 20
        const offset = query?.offset ?? 0

        const where = [isNull(productVariant.deletedAt)]

        if (query?.search) {
          where.push(ilike(productVariant.title, `%${query.search}%`))
        }

        if (query?.priceModifierType) {
          where.push(eq(productVariant.priceModifierType, query.priceModifierType))
        }

        const output = await db.query.productVariant.findMany({
          where: and(...where),
          limit: Math.min(limit, 100),
          offset,
          orderBy: (pv, { desc }) => [desc(pv.createdAt)],
        })

        return API_RESPONSE(STATUS.SUCCESS, MESSAGE.PRODUCT_VARIANT.GET_MANY.SUCCESS, output)
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT_VARIANT.GET_MANY.ERROR, null, err as Error)
      }
    }),

  // =========================
  // GET BY SLUG
  // =========================
  getBySlug: publicProcedure
    .input(productVariantContract.getBySlug.input)
    .output(productVariantContract.getBySlug.output)
    .query(async ({ input }) => {
      try {
        const { slug } = input.params

        const output = await db.query.productVariant.findFirst({
          where: (pv, { eq, and, isNull }) => and(eq(pv.slug, slug), isNull(pv.deletedAt)),
        })

        return API_RESPONSE(
          output ? STATUS.SUCCESS : STATUS.FAILED,
          output ? MESSAGE.PRODUCT_VARIANT.GET_BY_SLUG.SUCCESS : MESSAGE.PRODUCT_VARIANT.GET_BY_SLUG.FAILED,
          output ?? null,
        )
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT_VARIANT.GET_BY_SLUG.ERROR, null, err as Error)
      }
    }),

  // =========================
  // CREATE
  // =========================
  create: protectedProcedure
    .input(productVariantContract.create.input)
    .output(productVariantContract.create.output)
    .mutation(async ({ input }) => {
      try {
        const { body } = input
        const id = uuidv4()

        const cleanMedia = body.media?.filter(Boolean) ?? []
        const cleanAttributes = body.attributes ?? []

        const [output] = await db
          .insert(productVariant)
          .values({
            ...body,
            id,
            media: cleanMedia,
            attributes: cleanAttributes,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning()

        return API_RESPONSE(STATUS.SUCCESS, MESSAGE.PRODUCT_VARIANT.CREATE.SUCCESS, output)
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT_VARIANT.CREATE.ERROR, null, err as Error)
      }
    }),

  // =========================
  // UPDATE
  // =========================
  update: protectedProcedure
    .input(productVariantContract.update.input)
    .output(productVariantContract.update.output)
    .mutation(async ({ input }) => {
      try {
        const { id } = input.params
        const { body } = input

        const cleanMedia = body.media?.filter(Boolean) ?? undefined

        const cleanAttributes = body.attributes ?? undefined

        const [output] = await db
          .update(productVariant)
          .set({
            ...body,
            media: cleanMedia,
            attributes: cleanAttributes,
            updatedAt: new Date(),
          })
          .where(eq(productVariant.id, id))
          .returning()

        return API_RESPONSE(
          output ? STATUS.SUCCESS : STATUS.FAILED,
          output ? MESSAGE.PRODUCT_VARIANT.UPDATE.SUCCESS : MESSAGE.PRODUCT_VARIANT.UPDATE.FAILED,
          output ?? null,
        )
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT_VARIANT.UPDATE.ERROR, null, err as Error)
      }
    }),

  // =========================
  // DELETE
  // =========================
  delete: protectedProcedure
    .input(productVariantContract.delete.input)
    .output(productVariantContract.delete.output)
    .mutation(async ({ input }) => {
      try {
        const { id } = input.params

        const [output] = await db
          .update(productVariant)
          .set({
            deletedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(productVariant.id, id))
          .returning({ id: productVariant.id })

        return API_RESPONSE(
          output ? STATUS.SUCCESS : STATUS.FAILED,
          output ? MESSAGE.PRODUCT_VARIANT.DELETE.SUCCESS : MESSAGE.PRODUCT_VARIANT.DELETE.FAILED,
          output ?? null,
        )
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT_VARIANT.DELETE.ERROR, null, err as Error)
      }
    }),

  // =========================
  // SEARCH
  // =========================
  search: publicProcedure
    .input(productVariantContract.search.input)
    .output(productVariantContract.search.output)
    .query(async ({ input }) => {
      try {
        const { q, limit } = input.query

        const output = await db.query.productVariant.findMany({
          where: (pv, { or, ilike, and, isNull }) =>
            and(isNull(pv.deletedAt), or(ilike(pv.title, `%${q}%`), ilike(pv.slug, `%${q}%`))),
          limit: Math.min(limit, 50),
          orderBy: (pv, { desc }) => [desc(pv.createdAt)],
        })

        return API_RESPONSE(STATUS.SUCCESS, MESSAGE.PRODUCT_VARIANT.SEARCH.SUCCESS, output)
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT_VARIANT.SEARCH.ERROR, null, err as Error)
      }
    }),

  // =========================
  // GET BY IDS
  // =========================
  getByIds: publicProcedure
    .input(productVariantContract.getByIds.input)
    .output(productVariantContract.getByIds.output)
    .query(async ({ input }) => {
      try {
        const { ids } = input

        if (!ids.length) {
          return API_RESPONSE(STATUS.FAILED, MESSAGE.PRODUCT_VARIANT.GET_BY_IDS.FAILED, [])
        }

        const output = await db.query.productVariant.findMany({
          where: (pv, { and, inArray, isNull }) => and(inArray(pv.id, ids), isNull(pv.deletedAt)),
        })

        return API_RESPONSE(STATUS.SUCCESS, MESSAGE.PRODUCT_VARIANT.GET_BY_IDS.SUCCESS, output)
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT_VARIANT.GET_BY_IDS.ERROR, null, err as Error)
      }
    }),
})

export type ProductVariantRouter = typeof productVariantRouter
