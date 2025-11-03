import {
  type CreateServiceInput,
  type CreateServiceOutput,
  type DeleteServiceInput,
  type DeleteServiceOutput,
  type GetManyServiceInput,
  type GetManyServiceOutput,
  type GetServiceInput,
  type GetServiceOutput,
  type GetWithDetailsServiceInput,
  type GetWithDetailsServiceOutput,
  type SearchProductsServiceInput,
  type SearchProductsServiceOutput,
  type GetProductsByCategoryServiceInput,
  type GetProductsByCategoryServiceOutput,
  type UpdateServiceInput,
  type UpdateServiceOutput,
} from '../dto/types.product'

import { debugError } from '@/shared/utils/lib/logger.utils'
import { db } from '@/core/db/db'
import { eq, and, ilike, or, gte, lte, type SQL } from 'drizzle-orm'
import { product, type productVariant, type productImage } from '@/core/db/schema'
import { v4 as uuidv4 } from 'uuid'

export const productService = {
  get: async ({ body, params }: GetServiceInput): GetServiceOutput => {
    try {
      const data = await db.query.product.findFirst({
        where: (p, { eq }) => {
          if (params?.id) return eq(p.id, String(params.id))
          if (params?.slug) return eq(p.slug, String(params.slug))
          return undefined
        },
      })
      return data ?? null
    } catch (error) {
      debugError('SERVICE:PRODUCT:GET:ERROR', error)
      return null
    }
  },
  getWithDetails: async ({ body, params }: GetWithDetailsServiceInput): GetWithDetailsServiceOutput => {
    try {
      const data = await db.query.product.findFirst({
        where: (p, { eq }) => {
          if (params?.id) return eq(p.id, String(params.id))
          if (params?.slug) return eq(p.slug, String(params.slug))
          return undefined
        },
        with: {
          variants: {
            orderBy: (
              v: typeof productVariant,
              { asc }: { asc: (field: typeof productVariant.createdAt) => SQL<unknown> },
            ) => asc(v.createdAt),
          },
          images: {
            orderBy: (
              img: typeof productImage,
              { asc }: { asc: (field: typeof productImage.position) => SQL<unknown> },
            ) => asc(img.position),
          },
        },
      })
      return data ?? null
    } catch (error) {
      debugError('SERVICE:PRODUCT:GET_WITH_DETAILS:ERROR', error)
      return null
    }
  },
  getMany: async ({ body }: GetManyServiceInput): GetManyServiceOutput => {
    try {
      const conditions = []
      if (body?.categoryId) conditions.push(eq(product.categoryId, String(body.categoryId)))
      if (body?.brand) conditions.push(eq(product.brand, String(body.brand)))
      if (body?.isActive !== undefined) conditions.push(eq(product.isActive, Boolean(body.isActive)))
      if (body?.search) {
        conditions.push(
          or(
            ilike(product.name, `%${body.search}%`),
            ilike(product.description, `%${body.search}%`),
            ilike(product.brand, `%${body.search}%`),
          ),
        )
      }

      const data = await db.query.product.findMany({
        where: conditions.length ? and(...conditions) : undefined,
        orderBy: (p, { desc }) => desc(p.createdAt),
        limit: body?.limit ?? 50,
        offset: body?.offset ?? 0,
      })

      return data
    } catch (error) {
      debugError('SERVICE:PRODUCT:GET_MANY:ERROR', error)
      return null
    }
  },
  searchProducts: async ({ body }: SearchProductsServiceInput): SearchProductsServiceOutput => {
    try {
      const conditions = [
        or(
          ilike(product.name, `%${body.query}%`),
          ilike(product.description, `%${body.query}%`),
          ilike(product.brand, `%${body.query}%`),
        ),
      ]
      if (body?.categoryId) conditions.push(eq(product.categoryId, String(body.categoryId)))

      const data = await db.query.product.findMany({
        where: and(...conditions),
        orderBy: (p, { desc }) => desc(p.createdAt),
        limit: body?.limit ?? 50,
        offset: body?.offset ?? 0,
      })

      return data
    } catch (error) {
      debugError('SERVICE:PRODUCT:SEARCH_PRODUCTS:ERROR', error)
      return null
    }
  },
  getProductsByCategory: async ({
    body,
    params,
  }: GetProductsByCategoryServiceInput): GetProductsByCategoryServiceOutput => {
    try {
      const conditions = [eq(product.categoryId, String(params.categoryId))]
      if (body?.isActive !== undefined) conditions.push(eq(product.isActive, Boolean(body.isActive)))

      const data = await db.query.product.findMany({
        where: and(...conditions),
        orderBy: (p, { desc }) => desc(p.createdAt),
        limit: body?.limit ?? 50,
        offset: body?.offset ?? 0,
      })

      return data
    } catch (error) {
      debugError('SERVICE:PRODUCT:GET_PRODUCTS_BY_CATEGORY:ERROR', error)
      return null
    }
  },
  create: async ({ body }: CreateServiceInput): CreateServiceOutput => {
    try {
      const [data] = await db
        .insert(product)
        .values({
          id: uuidv4(),
          name: body.name,
          slug: body.slug,
          description: body.description ?? null,
          brand: body.brand ?? null,
          categoryId: body.categoryId ?? null,
          basePrice: body.basePrice,
          currency: body.currency ?? 'INR',
          isActive: body.isActive ?? true,
        })
        .returning()

      return data
    } catch (error) {
      debugError('SERVICE:PRODUCT:CREATE:ERROR', error)
      return null
    }
  },
  update: async ({ body, params }: UpdateServiceInput): UpdateServiceOutput => {
    try {
      const [data] = await db
        .update(product)
        .set({
          name: body.name ?? undefined,
          slug: body.slug ?? undefined,
          description: body.description ?? undefined,
          brand: body.brand ?? undefined,
          categoryId: body.categoryId ?? undefined,
          basePrice: body.basePrice ?? undefined,
          currency: body.currency ?? undefined,
          isActive: body.isActive ?? undefined,
          updatedAt: new Date(),
        })
        .where(eq(product.id, String(params.id)))
        .returning()

      return data
    } catch (error) {
      debugError('SERVICE:PRODUCT:UPDATE:ERROR', error)
      return null
    }
  },
  delete: async ({ params }: DeleteServiceInput): DeleteServiceOutput => {
    try {
      const [deleted] = await db
        .delete(product)
        .where(eq(product.id, String(params.id)))
        .returning({ id: product.id })
      return deleted
    } catch (error) {
      debugError('SERVICE:PRODUCT:DELETE:ERROR', error)
      return null
    }
  },
}
