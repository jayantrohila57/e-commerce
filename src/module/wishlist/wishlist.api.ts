import { createTRPCRouter, protectedProcedure } from '@/core/api/api.methods'
import { db } from '@/core/db/db'
import { wishlist } from '@/core/db/db.schema'
import { MESSAGE, STATUS } from '@/shared/config/api.config'
import { API_RESPONSE } from '@/shared/config/api.utils'
import { debugError } from '@/shared/utils/lib/logger.utils'
import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import type { WishlistSelectSchema } from './wishlist.schema'
import { wishlistContract } from './wishlist.schema'

// db row for wishlist table (base fields returned when "with" is not used)
type WishlistRow = { id: string; userId: string; variantId: string }

export const wishlistRouter = createTRPCRouter({
  getUserWishlist: protectedProcedure
    .input(wishlistContract.getUserWishlist.input)
    .output(wishlistContract.getUserWishlist.output)
    .query(async ({ ctx, input }) => {
      try {
        const userId = ctx.user!.id

        const items = (await db.query.wishlist.findMany({
          where: (w, { eq }) => eq(w.userId, userId),
          with: {
            variant: {
              with: {
                product: true,
              },
            },
          },
          limit: input.query?.limit ?? undefined,
          offset: input.query?.offset ?? undefined,
        })) as WishlistSelectSchema[]

        return API_RESPONSE<WishlistSelectSchema[]>(STATUS.SUCCESS, MESSAGE.WISHLIST.GET_USER_WISHLIST.SUCCESS, items)
      } catch (err) {
        debugError('WISHLIST:GET_USER_WISHLIST:ERROR', err)
        const error = err instanceof Error ? err : new Error(String(err))
        return API_RESPONSE(STATUS.ERROR, MESSAGE.WISHLIST.GET_USER_WISHLIST.ERROR, null, error)
      }
    }),

  addItem: protectedProcedure
    .input(wishlistContract.addItem.input)
    .output(wishlistContract.addItem.output)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user!.id
        const variantId = input.body.variantId

        const existing = (await db.query.wishlist.findFirst({
          where: (w, { and, eq }) => and(eq(w.userId, userId), eq(w.variantId, variantId)),
        })) as WishlistRow | null

        if (existing) {
          const hydrated = (await db.query.wishlist.findFirst({
            where: (w, { eq }) => eq(w.id, existing.id),
            with: {
              variant: {
                with: {
                  product: true,
                },
              },
            },
          })) as WishlistSelectSchema | null

          return API_RESPONSE<WishlistSelectSchema | null>(STATUS.FAILED, MESSAGE.WISHLIST.ADD_ITEM.FAILED, hydrated)
        }

        const [raw] = await db.insert(wishlist).values({ id: uuidv4(), userId, variantId }).returning()

        const created = (await db.query.wishlist.findFirst({
          where: (w, { eq }) => eq(w.id, raw.id),
          with: {
            variant: {
              with: {
                product: true,
              },
            },
          },
        })) as WishlistSelectSchema | null

        return API_RESPONSE<WishlistSelectSchema | null>(STATUS.SUCCESS, MESSAGE.WISHLIST.ADD_ITEM.SUCCESS, created)
      } catch (err) {
        debugError('WISHLIST:ADD_ITEM:ERROR', err)
        const error = err instanceof Error ? err : new Error(String(err))
        return API_RESPONSE(STATUS.ERROR, MESSAGE.WISHLIST.ADD_ITEM.ERROR, null, error)
      }
    }),

  removeItem: protectedProcedure
    .input(wishlistContract.removeItem.input)
    .output(wishlistContract.removeItem.output)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user!.id
        const { id, variantId } = input.params

        if (!id && !variantId) {
          return API_RESPONSE<WishlistSelectSchema | null>(STATUS.FAILED, MESSAGE.WISHLIST.REMOVE_ITEM.FAILED, null)
        }

        // fetch the item (hydrated) BEFORE deleting so we can return full shape
        let toReturn: WishlistSelectSchema | null = null
        if (id) {
          toReturn = (await db.query.wishlist.findFirst({
            where: (w, { and, eq }) => and(eq(w.id, id), eq(w.userId, userId)),
            with: {
              variant: {
                with: {
                  product: true,
                },
              },
            },
          })) as WishlistSelectSchema | null
        } else {
          toReturn = (await db.query.wishlist.findFirst({
            where: (w, { and, eq }) => and(eq(w.variantId, variantId!), eq(w.userId, userId)),
            with: {
              variant: {
                with: {
                  product: true,
                },
              },
            },
          })) as WishlistSelectSchema | null
        }

        if (!toReturn) {
          // item not found for this user
          return API_RESPONSE<WishlistSelectSchema | null>(STATUS.FAILED, MESSAGE.WISHLIST.REMOVE_ITEM.FAILED, null)
        }

        // now delete by id (we have id from toReturn)
        await db.delete(wishlist).where(eq(wishlist.id, toReturn.id))

        // return the hydrated object we fetched earlier
        return API_RESPONSE<WishlistSelectSchema | null>(STATUS.SUCCESS, MESSAGE.WISHLIST.REMOVE_ITEM.SUCCESS, toReturn)
      } catch (err) {
        debugError('WISHLIST:REMOVE_ITEM:ERROR', err)
        const error = err instanceof Error ? err : new Error(String(err))
        return API_RESPONSE(STATUS.ERROR, MESSAGE.WISHLIST.REMOVE_ITEM.ERROR, null, error)
      }
    }),

  clear: protectedProcedure
    .input(wishlistContract.clear.input)
    .output(wishlistContract.clear.output)
    .mutation(async ({ ctx }) => {
      try {
        const userId = ctx.user!.id

        const deleted = await db.delete(wishlist).where(eq(wishlist.userId, userId)).returning()

        return API_RESPONSE(STATUS.SUCCESS, MESSAGE.WISHLIST.DELETE.SUCCESS, { clearedCount: deleted?.length ?? 0 })
      } catch (err) {
        debugError('WISHLIST:CLEAR:ERROR', err)
        const error = err instanceof Error ? err : new Error(String(err))
        return API_RESPONSE(STATUS.ERROR, MESSAGE.WISHLIST.DELETE.ERROR, null, error)
      }
    }),
})
