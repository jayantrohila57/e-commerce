import { createTRPCRouter, protectedProcedure } from '@/core/api/api.methods'
import { db } from '@/core/db/db'
import { cart, cartLine } from '@/core/db/db.schema'
import { MESSAGE, STATUS } from '@/shared/config/api.config'
import { API_RESPONSE } from '@/shared/config/api.utils'
import { debugError } from '@/shared/utils/lib/logger.utils'
import { v4 as uuidv4 } from 'uuid'
import { cartContract } from './cart.schema'
import { eq } from 'drizzle-orm'

export const cartRouter = createTRPCRouter({
  getUserCart: protectedProcedure
    .input(cartContract.getUserCart.input)
    .output(cartContract.getUserCart.output)
    .query(async ({ ctx, input }) => {
      try {
        const userId = ctx.user!.id

        // find cart for user
        const existingCart = await db.query.cart.findFirst({ where: (c, { eq }) => eq(c.userId, userId) })

        if (!existingCart) return API_RESPONSE(STATUS.FAILED, MESSAGE.CART.GET_USER_CART.FAILED, [])

        const lines = await db.query.cartLine.findMany({
          where: (l, { eq }) => eq(l.cartId, existingCart.id),
          with: {
            variant: {
              with: { product: true },
            },
          },
          limit: input.query?.limit ?? undefined,
          offset: input.query?.offset ?? undefined,
        })

        return API_RESPONSE(STATUS.SUCCESS, MESSAGE.CART.GET_USER_CART.SUCCESS, lines)
      } catch (err) {
        debugError('CART:GET_USER_CART:ERROR', err)
        return API_RESPONSE(STATUS.ERROR, MESSAGE.CART.GET_USER_CART.ERROR, null, err as Error)
      }
    }),

  addItem: protectedProcedure
    .input(cartContract.addItem.input)
    .output(cartContract.addItem.output)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user!.id
        const { variantId, quantity } = input.body

        // get or create cart
        let existingCart = await db.query.cart.findFirst({ where: (c, { eq }) => eq(c.userId, userId) })
        if (!existingCart) {
          const [newCart] = await db.insert(cart).values({ id: uuidv4(), userId }).returning()
          existingCart = newCart
        }

        // If a cartline already exists for this variant, increment quantity
        const existingLine = await db.query.cartLine.findFirst({
          where: (cl, { and, eq }) => and(eq(cl.cartId, existingCart!.id), eq(cl.variantId, variantId)),
        })

        if (existingLine) {
          const updated = await db
            .update(cartLine)
            .set({ quantity: existingLine.quantity + (quantity ?? 1) })
            .where(eq(cartLine.id, existingLine.id))
            .returning()
          return API_RESPONSE(STATUS.SUCCESS, MESSAGE.CART.ADD_ITEM.SUCCESS, updated?.[0] ?? null)
        }

        // Try to snapshot a price (fallback 0)
        let priceSnapshot = 0
        const variant = await db.query.productVariant.findFirst({ where: (v, { eq }) => eq(v.id, variantId) })
        if (variant) {
          priceSnapshot = Number(variant.priceModifierValue ?? 0)
        }

        const [created] = await db
          .insert(cartLine)
          .values({
            id: uuidv4(),
            cartId: existingCart!.id,
            variantId,
            quantity: quantity ?? 1,
            price: priceSnapshot ?? 0,
          })
          .returning()

        return API_RESPONSE(STATUS.SUCCESS, MESSAGE.CART.ADD_ITEM.SUCCESS, created)
      } catch (err) {
        debugError('CART:ADD_ITEM:ERROR', err)
        return API_RESPONSE(STATUS.ERROR, MESSAGE.CART.ADD_ITEM.ERROR, null, err as Error)
      }
    }),
})
