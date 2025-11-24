// src/module/product-variant/product-variant.api.ts
import { createTRPCRouter, protectedProcedure } from '@/core/api/api.methods'
import { MESSAGE, STATUS } from '@/shared/config/api.config'
import { API_RESPONSE } from '@/shared/config/api.utils'

import { db } from '@/core/db/db'
import { productVariant } from '@/core/db/db.schema'
import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { productVariantContract } from './product-variant.schema'

export const productVariantRouter = createTRPCRouter({
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
})

export type ProductVariantRouter = typeof productVariantRouter
