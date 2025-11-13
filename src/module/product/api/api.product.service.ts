import {
  type GetServiceInput,
  type GetServiceOutput,
  type GetManyServiceInput,
  type GetManyServiceOutput,
  type GetProductWithSubcategoriesServiceInput,
  type GetProductWithSubcategoriesServiceOutput,
  type CreateServiceInput,
  type CreateServiceOutput,
  type UpdateServiceInput,
  type UpdateServiceOutput,
  type DeleteServiceInput,
  type DeleteServiceOutput,
  type SearchServiceInput,
  type SearchServiceOutput,
} from '../dto/dto.product.types'

import { debugError, debugLog } from '@/shared/utils/lib/logger.utils'
import { db } from '@/core/db/db'
import { eq, and, or, ilike, isNull } from 'drizzle-orm'
import { product, productVariant } from '@/core/db/schema'
import { v4 as uuidv4 } from 'uuid'

export const productService = {
  get: async ({ params }: GetServiceInput): GetServiceOutput => {
    try {
      if (!params?.id && !params?.slug) {
        debugError('SERVICE:PRODUCT:GET:ERROR', 'Missing id or slug parameter')
        return null
      }

      const data = await db.query.product.findFirst({
        where: (p, { eq, and, isNull }) => {
          const conditions = []

          if (params.id) conditions.push(eq(p.id, String(params.id)))
          if (params.slug) conditions.push(eq(p.slug, String(params.slug)))

          // Only include non-deleted products
          conditions.push(isNull(p.deletedAt))

          return and(...conditions)
        },
      })

      return data ?? null
    } catch (error) {
      debugError('SERVICE:PRODUCT:GET:ERROR', error)
      return null
    }
  },

  getMany: async ({ query = {} }: GetManyServiceInput = {}): GetManyServiceOutput => {
    try {
      const { search, limit = 50, offset = 0, isFeatured, visibility } = query
      const conditions = []

      // Add search condition
      if (search) {
        conditions.push(or(ilike(product.title, `%${search}%`), ilike(product.description, `%${search}%`)))
      }

      // Always exclude deleted items
      conditions.push(isNull(product.deletedAt))

      const data = await db.query.product.findMany({
        where: conditions.length > 0 ? and(...conditions) : undefined,
        limit: Math.min(100, limit), // Enforce a max limit
        offset,
        orderBy: (p, { desc }) => [desc(p.createdAt)],
      })

      return data
    } catch (error) {
      debugError('SERVICE:PRODUCT:GET_MANY:ERROR', error)
      return null
    }
  },

  getBySlug: async ({ params }: GetProductWithSubcategoriesServiceInput): GetProductWithSubcategoriesServiceOutput => {
    try {
      if (!params?.slug) {
        debugError('SERVICE:PRODUCT:GET_BY_SLUG:ERROR', 'Missing slug parameter')
        return null
      }

      // Get the product with its variants in a single query
      const [productData] = await db
        .select()
        .from(product)
        .where(and(eq(product.slug, params.slug), isNull(product.deletedAt), eq(product.isActive, true)))
        .limit(1)

      return productData ? { product: productData } : null
    } catch (error) {
      debugError('SERVICE:PRODUCT:GET_BY_SLUG:ERROR', error)
      return null
    }
  },

  create: async ({ body }: CreateServiceInput): CreateServiceOutput => {
    try {
      const now = new Date()
      const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')

      const [data] = await db
        .insert(product)
        .values({
          id: uuidv4(),
          title: body.title,
          description: body.description || null,
          metaTitle: body.metaTitle || null,
          metaDescription: body.metaDescription || null,
          slug,
          seriesSlug: body.seriesSlug,
          baseImage: body.baseImage || null,
          isActive: body.isActive !== undefined ? body.isActive : true,
          deletedAt: null,
          createdAt: now,
          updatedAt: now,
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
      // Get existing product
      const [existingProduct] = await db
        .select()
        .from(product)
        .where(and(eq(product.id, String(params.id)), isNull(product.deletedAt)))
        .limit(1)

      if (!existingProduct) {
        debugLog('SERVICE:PRODUCT:UPDATE:NOT_FOUND', { id: params.id })
        return null
      }

      // Check for slug uniqueness if it's being updated
      if (body.slug && body.slug !== existingProduct.slug) {
        const [existingSlug] = await db
          .select()
          .from(product)
          .where(and(eq(product.slug, body.slug), isNull(product.deletedAt)))
          .limit(1)

        if (existingSlug) {
          debugLog('SERVICE:PRODUCT:UPDATE:SLUG_EXISTS', { slug: body.slug })
          return null
        }
      }

      // Prepare update data with only provided fields
      const updateData: Partial<typeof product.$inferInsert> = {
        updatedAt: new Date(),
      }

      // Only update fields that were explicitly provided in the request
      if (body.title !== undefined) updateData.title = body.title
      if (body.description !== undefined) updateData.description = body.description
      if (body.metaTitle !== undefined) updateData.metaTitle = body.metaTitle
      if (body.metaDescription !== undefined) updateData.metaDescription = body.metaDescription
      if (body.slug !== undefined) updateData.slug = body.slug
      if (body.seriesSlug !== undefined) updateData.seriesSlug = body.seriesSlug
      if (body.baseImage !== undefined) updateData.baseImage = body.baseImage
      if (body.isActive !== undefined) updateData.isActive = body.isActive

      // Perform the update
      const [updatedProduct] = await db
        .update(product)
        .set(updateData)
        .where(eq(product.id, String(params.id)))
        .returning()

      if (!updatedProduct) {
        debugLog('SERVICE:PRODUCT:UPDATE:FAILED', { id: params.id })
        return null
      }

      const updatedFields = Object.keys(body).filter((key) => body[key as keyof typeof body] !== undefined)
      debugLog('SERVICE:PRODUCT:UPDATE:SUCCESS', {
        id: params.id,
        updatedFields,
      })

      return updatedProduct
    } catch (error) {
      debugError('SERVICE:PRODUCT:UPDATE:ERROR', {
        id: params.id,
        error: error instanceof Error ? error.message : String(error),
      })
      return null
    }
  },

  delete: async ({ params }: DeleteServiceInput): DeleteServiceOutput => {
    try {
      // First check if product exists and is not already deleted
      const [existingProduct] = await db
        .select()
        .from(product)
        .where(and(eq(product.id, String(params.id)), isNull(product.deletedAt)))
        .limit(1)

      if (!existingProduct) {
        debugLog('SERVICE:PRODUCT:DELETE:NOT_FOUND', { id: params.id })
        return null
      }

      const now = new Date()
      const [deletedProduct] = await db
        .update(product)
        .set({
          deletedAt: now,
          updatedAt: now,
          slug: `${existingProduct.slug}-deleted-${Date.now()}`,
          isActive: false,
        })
        .where(eq(product.id, String(params.id)))
        .returning()

      if (!deletedProduct) {
        debugLog('SERVICE:PRODUCT:DELETE:FAILED', { id: params.id })
        return null
      }

      debugLog('SERVICE:PRODUCT:DELETE:SUCCESS', { id: params.id })
      return { id: deletedProduct.id }
    } catch (error) {
      debugError('SERVICE:PRODUCT:DELETE:ERROR', error)
      return null
    }
  },

  search: async ({ query }: SearchServiceInput): SearchServiceOutput => {
    try {
      const data = await db.query.product.findMany({
        where: and(ilike(product.title, `%${query.q}%`), isNull(product.deletedAt)),
        limit: query.limit ?? 10,
        orderBy: (p, { asc }) => [asc(p.createdAt)],
      })
      return data
    } catch (error) {
      debugError('SERVICE:PRODUCT:SEARCH:ERROR', error)
      return null
    }
  },
}
