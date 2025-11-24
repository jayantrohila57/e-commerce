import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/core/api/api.methods'
import { MESSAGE, STATUS } from '@/shared/config/api.config'
import { API_RESPONSE } from '@/shared/config/api.utils'
import { debugError } from '@/shared/utils/lib/logger.utils'

import { db } from '@/core/db/db'
import { product } from '@/core/db/db.schema'
import { and, eq, ilike, isNull } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { productContract } from './product.schema'

export const productRouter = createTRPCRouter({
  get: protectedProcedure
    .input(productContract.get.input)
    .output(productContract.get.output)
    .query(async ({ input }) => {
      try {
        const { id, slug } = input.params

        if (!id && !slug) {
          return API_RESPONSE(STATUS.FAILED, MESSAGE.PRODUCT.GET.FAILED, null)
        }

        let row: typeof product.$inferSelect | undefined

        if (id) {
          const output = await db
            .select()
            .from(product)
            .where(and(eq(product.id, id), isNull(product.deletedAt)))
            .limit(1)
          row = output?.[0]
        } else if (slug) {
          const output = await db
            .select()
            .from(product)
            .where(and(eq(product.slug, slug), isNull(product.deletedAt)))
            .limit(1)
          row = output?.[0]
        }

        return API_RESPONSE(
          row ? STATUS.SUCCESS : STATUS.FAILED,
          row ? MESSAGE.PRODUCT.GET.SUCCESS : MESSAGE.PRODUCT.GET.FAILED,
          row ?? null,
        )
      } catch (err) {
        debugError('PRODUCT:GET:ERROR', err)
        return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT.GET.ERROR, null, err as Error)
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
  getMany: protectedProcedure
    .input(productContract.getMany.input)
    .output(productContract.getMany.output)
    .query(async ({ input }) => {
      try {
        const { query } = input
        const { limit, offset, categorySlug, seriesSlug, isActive } = query

        const products = await db.query.product.findMany({
          limit,
          offset,
          where: (p, { and, eq, isNull }) => {
            const conditions = [isNull(p.deletedAt)]
            if (categorySlug) conditions.push(eq(p.categorySlug, categorySlug))
            if (seriesSlug) conditions.push(eq(p.seriesSlug, seriesSlug))
            if (isActive !== undefined) conditions.push(eq(p.isActive, isActive))
            return and(...conditions)
          },
          orderBy: (p, { desc }) => [desc(p.createdAt)],
        })

        return API_RESPONSE(STATUS.SUCCESS, MESSAGE.PRODUCT.GET_MANY.SUCCESS, products)
      } catch (err) {
        debugError('PRODUCT:GET_MANY:ERROR', err)
        return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT.GET_MANY.ERROR, null, err as Error)
      }
    }),
  getProductsBySeriesSlug: publicProcedure
    .input(productContract.getProductsBySeriesSlug.input)
    .output(productContract.getProductsBySeriesSlug.output)
    .query(async ({ input }) => {
      try {
        const { slug } = input.params

        const products = await db.query.product.findMany({
          where: (p, { eq, and, isNull }) => and(eq(p.seriesSlug, slug), isNull(p.deletedAt), eq(p.isActive, true)),
          with: {
            variants: {
              where: (pv, { isNull }) => isNull(pv.deletedAt),
              orderBy: (pv, { asc }) => [asc(pv.createdAt)],
            },
          },
          orderBy: (p, { desc }) => [desc(p.createdAt)],
        })

        if (!products.length) {
          return API_RESPONSE(STATUS.FAILED, MESSAGE.PRODUCT.GET_BY_SERIES.FAILED, [])
        }

        const flattened = products.flatMap((p) =>
          p.variants.map((v) => ({
            ...p,
            variant: v,
          })),
        )

        return API_RESPONSE(STATUS.SUCCESS, MESSAGE.PRODUCT.GET_BY_SERIES.SUCCESS, flattened)
      } catch (err) {
        debugError('PRODUCT:GET_BY_SERIES:ERROR', err)
        return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT.GET_BY_SERIES.ERROR, null, err as Error)
      }
    }),
  getPDPProductByVariant: publicProcedure
    .input(productContract.getPDPProduct.input)
    .output(productContract.getPDPProduct.output)
    .query(async ({ input }) => {
      try {
        const { slug } = input.params

        // Step 1: locate the variant by its slug
        const variant = await db.query.productVariant.findFirst({
          where: (pv, { eq, and, isNull }) => and(eq(pv.slug, slug), isNull(pv.deletedAt)),
        })

        if (!variant) {
          return API_RESPONSE(STATUS.FAILED, MESSAGE.PRODUCT.GET_PDP_PRODUCT.NOT_FOUND, null)
        }

        // Step 2: fetch the product AND all its variants
        const product = await db.query.product.findFirst({
          where: (p, { eq, and, isNull }) => and(eq(p.id, variant.productId), isNull(p.deletedAt)),
          with: {
            variants: {
              where: (pv, { eq, isNull }) => isNull(pv.deletedAt), // fetch ALL alive variants
            },
          },
        })

        if (!product) {
          return API_RESPONSE(STATUS.FAILED, MESSAGE.PRODUCT.GET_PDP_PRODUCT.FAILED, null)
        }

        return API_RESPONSE(STATUS.SUCCESS, MESSAGE.PRODUCT.GET_PDP_PRODUCT.SUCCESS, {
          product: {
            ...product,
            variants: product.variants, // full squad
          },
        })
      } catch (err) {
        debugError('PRODUCT:GET_PDP_PRODUCT:ERROR', err)
        return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT.GET_PDP_PRODUCT.ERROR, null, err as Error)
      }
    }),
  getProductWithProductVariants: publicProcedure
    .input(productContract.getProductWithProductVariants.input)
    .output(productContract.getProductWithProductVariants.output)
    .query(async ({ input }) => {
      try {
        const output = await db.query.product.findFirst({
          where: (c, { eq }) => eq(c.slug, input.params.slug),
          with: {
            variants: {
              orderBy: (s, { asc }) => [asc(s.createdAt)],
            },
          },
        })

        const row = output ?? null

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
        const body = input.body

        const slug = body.slug ?? body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now()

        const [output] = await db
          .insert(product)
          .values({
            id: uuidv4(),
            title: body.title,
            description: body.description ?? null,
            metaTitle: body.metaTitle ?? null,
            metaDescription: body.metaDescription ?? null,
            slug,

            // new required fields
            categorySlug: body.categorySlug,
            subcategorySlug: body.subcategorySlug,
            seriesSlug: body.seriesSlug,

            basePrice: body.basePrice,
            baseCurrency: body.baseCurrency ?? 'INR',

            features: body.features ?? null,

            status: body.status ?? 'draft',
            isActive: body.isActive ?? true,

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

        // Build update object dynamically
        const updateData: Record<string, any> = { updatedAt: new Date() }

        for (const key in body) {
          const value = body[key as keyof typeof body]
          if (value !== undefined) updateData[key] = value
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
  search: publicProcedure
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
          output.length ? STATUS.SUCCESS : STATUS.FAILED,
          output.length ? MESSAGE.PRODUCT.SEARCH.SUCCESS : MESSAGE.PRODUCT.SEARCH.FAILED,
          output,
        )
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT.SEARCH.ERROR, [], err as Error)
      }
    }),
})
