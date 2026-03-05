import { and, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { createCallerFactory, createTRPCRouter, customerProcedure } from "@/core/api/api.methods";
import { db } from "@/core/db/db";
import { wishlist } from "@/core/db/db.schema";
import { cartRouter } from "@/module/cart/cart.api";
import { STATUS } from "@/shared/config/api.config";
import { API_RESPONSE } from "@/shared/config/api.utils";
import { debugError } from "@/shared/utils/lib/logger.utils";
import { wishlistContract } from "./wishlist.schema";

const createCartCaller = createCallerFactory(cartRouter);

export const wishlistRouter = createTRPCRouter({
  /**
   * Get user's wishlist
   */
  get: customerProcedure
    .input(wishlistContract.get.input)
    .output(wishlistContract.get.output)
    .query(async ({ ctx }) => {
      try {
        const userId = ctx.user.id;

        const data = await db.query.wishlist.findMany({
          where: eq(wishlist.userId, userId),
          with: {
            variant: {
              with: {
                product: true,
              },
            },
          },
        });

        // Map to match schema
        const mappedData = data.map((item) => ({
          id: item.id,
          userId: item.userId,
          variantId: item.variantId,
          variant: {
            id: item.variant.id,
            title: item.variant.title,
            product: {
              id: item.variant.product.id,
              title: item.variant.product.title,
              baseImage: item.variant.product.baseImage,
            },
          },
        }));

        return API_RESPONSE(STATUS.SUCCESS, "Wishlist retrieved", mappedData);
      } catch (err) {
        debugError("WISHLIST:GET:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error retrieving wishlist", [], err as Error);
      }
    }),

  /**
   * Add item to wishlist
   */
  add: customerProcedure
    .input(wishlistContract.add.input)
    .output(wishlistContract.add.output)
    .mutation(async ({ input, ctx }) => {
      try {
        const userId = ctx.user.id;
        const { variantId } = input.body;

        // Check if already in wishlist
        const existing = await db.query.wishlist.findFirst({
          where: and(eq(wishlist.userId, userId), eq(wishlist.variantId, variantId)),
        });

        if (existing) {
          return API_RESPONSE(STATUS.SUCCESS, "Item already in wishlist", existing);
        }

        const [newItem] = await db
          .insert(wishlist)
          .values({
            id: uuidv4(),
            userId,
            variantId,
          })
          .returning();

        return API_RESPONSE(STATUS.SUCCESS, "Item added to wishlist", newItem);
      } catch (err) {
        debugError("WISHLIST:ADD:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error adding to wishlist", null, err as Error);
      }
    }),

  /**
   * Remove item from wishlist
   */
  remove: customerProcedure
    .input(wishlistContract.remove.input)
    .output(wishlistContract.remove.output)
    .mutation(async ({ input, ctx }) => {
      try {
        const userId = ctx.user.id;
        const { id } = input.params;

        const existing = await db.query.wishlist.findFirst({
          where: and(eq(wishlist.id, id), eq(wishlist.userId, userId)),
        });

        if (!existing) {
          return API_RESPONSE(STATUS.FAILED, "Item not found in wishlist", null);
        }

        await db.delete(wishlist).where(eq(wishlist.id, id));

        return API_RESPONSE(STATUS.SUCCESS, "Item removed from wishlist", { id });
      } catch (err) {
        debugError("WISHLIST:REMOVE:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error removing from wishlist", null, err as Error);
      }
    }),

  /**
   * Clear all items from wishlist
   */
  clear: customerProcedure
    .input(wishlistContract.clear.input)
    .output(wishlistContract.clear.output)
    .mutation(async ({ ctx }) => {
      try {
        const userId = ctx.user.id;

        await db.delete(wishlist).where(eq(wishlist.userId, userId));

        return API_RESPONSE(STATUS.SUCCESS, "Wishlist cleared", { success: true });
      } catch (err) {
        debugError("WISHLIST:CLEAR:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error clearing wishlist", { success: false }, err as Error);
      }
    }),

  /**
   * Move item from wishlist to cart
   */
  moveToCart: customerProcedure
    .input(wishlistContract.moveToCart.input)
    .output(wishlistContract.moveToCart.output)
    .mutation(async ({ input, ctx }) => {
      try {
        const userId = ctx.user.id;
        const { id } = input.params;

        const wishlistItem = await db.query.wishlist.findFirst({
          where: and(eq(wishlist.id, id), eq(wishlist.userId, userId)),
        });

        if (!wishlistItem) {
          return API_RESPONSE(STATUS.FAILED, "Item not found in wishlist", null);
        }

        const cartCaller = createCartCaller(ctx);
        const cartResult = await cartCaller.add({
          body: {
            variantId: wishlistItem.variantId,
            quantity: 1,
            sessionId: undefined,
          },
        });

        if (cartResult.status !== STATUS.SUCCESS) {
          return API_RESPONSE(STATUS.FAILED, cartResult.message ?? "Failed to move item to cart", null);
        }

        await db.delete(wishlist).where(eq(wishlist.id, id));

        return API_RESPONSE(STATUS.SUCCESS, "Item moved to cart", { id });
      } catch (err) {
        debugError("WISHLIST:MOVE_TO_CART:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error moving item to cart", null, err as Error);
      }
    }),
});
