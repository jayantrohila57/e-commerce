import {
  type CreateServiceInput,
  type CreateServiceOutput,
  type DeleteServiceInput,
  type DeleteServiceOutput,
  type GetManyServiceInput,
  type GetManyServiceOutput,
  type GetServiceInput,
  type GetServiceOutput,
  type GetProductReviewsServiceInput,
  type GetProductReviewsServiceOutput,
  type GetUserReviewsServiceInput,
  type GetUserReviewsServiceOutput,
  type UpdateServiceInput,
  type UpdateServiceOutput,
} from '../dto/types.review'

import { debugError } from '@/shared/utils/lib/logger.utils'
import { db } from '@/core/db/db'
import { eq, and } from 'drizzle-orm'
import { review } from '@/core/db/schema'
import { v4 as uuidv4 } from 'uuid'

export const reviewService = {
  get: async ({ body, params }: GetServiceInput): GetServiceOutput => {
    try {
      const data = await db.query.review.findFirst({
        where: (r, { eq }) => {
          if (params?.id) return eq(r.id, String(params.id))
          return undefined
        },
      })
      return data ?? null
    } catch (error) {
      debugError('SERVICE:REVIEW:GET:ERROR', error)
      return null
    }
  },
  getMany: async ({ body }: GetManyServiceInput): GetManyServiceOutput => {
    try {
      const conditions = []
      if (body?.productId) conditions.push(eq(review.productId, String(body.productId)))
      if (body?.userId) conditions.push(eq(review.userId, String(body.userId)))
      if (body?.rating) conditions.push(eq(review.rating, Number(body.rating)))

      const data = await db.query.review.findMany({
        where: conditions.length ? and(...conditions) : undefined,
        orderBy: (r, { desc }) => desc(r.createdAt),
        limit: body?.limit ?? 50,
        offset: body?.offset ?? 0,
      })

      return data
    } catch (error) {
      debugError('SERVICE:REVIEW:GET_MANY:ERROR', error)
      return null
    }
  },
  getProductReviews: async ({ body, params }: GetProductReviewsServiceInput): GetProductReviewsServiceOutput => {
    try {
      const conditions = [eq(review.productId, String(params.productId))]
      if (body?.rating) conditions.push(eq(review.rating, Number(body.rating)))

      const data = await db.query.review.findMany({
        where: and(...conditions),
        orderBy: (r, { desc }) => desc(r.createdAt),
        limit: body?.limit ?? 50,
        offset: body?.offset ?? 0,
      })
      return data
    } catch (error) {
      debugError('SERVICE:REVIEW:GET_PRODUCT_REVIEWS:ERROR', error)
      return null
    }
  },
  getUserReviews: async ({ body, params }: GetUserReviewsServiceInput): GetUserReviewsServiceOutput => {
    try {
      const data = await db.query.review.findMany({
        where: (r, { eq }) => eq(r.userId, String(params.userId)),
        orderBy: (r, { desc }) => desc(r.createdAt),
        limit: body?.limit ?? 50,
        offset: body?.offset ?? 0,
      })
      return data
    } catch (error) {
      debugError('SERVICE:REVIEW:GET_USER_REVIEWS:ERROR', error)
      return null
    }
  },
  create: async ({ body }: CreateServiceInput): CreateServiceOutput => {
    try {
      const [data] = await db
        .insert(review)
        .values({
          id: uuidv4(),
          userId: body.userId ?? null,
          productId: body.productId ?? null,
          rating: body.rating,
          comment: body.comment ?? null,
        })
        .returning()

      return data
    } catch (error) {
      debugError('SERVICE:REVIEW:CREATE:ERROR', error)
      return null
    }
  },
  update: async ({ body, params }: UpdateServiceInput): UpdateServiceOutput => {
    try {
      const [data] = await db
        .update(review)
        .set({
          userId: body.userId ?? undefined,
          productId: body.productId ?? undefined,
          rating: body.rating ?? undefined,
          comment: body.comment ?? undefined,
        })
        .where(eq(review.id, String(params.id)))
        .returning()

      return data
    } catch (error) {
      debugError('SERVICE:REVIEW:UPDATE:ERROR', error)
      return null
    }
  },
  delete: async ({ params }: DeleteServiceInput): DeleteServiceOutput => {
    try {
      const [deleted] = await db
        .delete(review)
        .where(eq(review.id, String(params.id)))
        .returning({ id: review.id })
      return deleted
    } catch (error) {
      debugError('SERVICE:REVIEW:DELETE:ERROR', error)
      return null
    }
  },
}
