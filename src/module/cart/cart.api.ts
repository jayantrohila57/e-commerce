import { and, eq, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { createTRPCRouter, customerProcedure, publicProcedure } from "@/core/api/api.methods";
import { db } from "@/core/db/db";
import { cart, cartLine, inventoryItem, inventoryReservation, productVariant } from "@/core/db/db.schema";
import { applyInventoryDelta, getInventoryForVariantAndWarehouse } from "@/module/inventory/inventory.api";
import { MESSAGE, STATUS } from "@/shared/config/api.config";
import { API_RESPONSE } from "@/shared/config/api.utils";
import { debugError } from "@/shared/utils/lib/logger.utils";
import { cartContract } from "./cart.schema";

/**
 * Guest carts are bound to the `cart_session_id` cookie (`ctx.guestCartSessionId`).
 * Authenticated carts use `ctx.user.id` only — never trust client-supplied userId for reads/writes.
 */
type CartRow = typeof cart.$inferSelect;

/**
 * Resolve cart by a single owner key (never mix user + guest OR — avoids cart fixation).
 */
async function getOrCreateCart(opts: { userId?: string; sessionId?: string }): Promise<CartRow> {
  const { userId, sessionId } = opts;
  if (!userId && !sessionId) {
    throw new Error("Either userId or sessionId is required");
  }

  let existingCart = await db.query.cart.findFirst({
    where: userId ? eq(cart.userId, userId) : eq(cart.sessionId, sessionId!),
  });

  if (!existingCart) {
    const [newCart] = await db
      .insert(cart)
      .values({
        id: uuidv4(),
        userId: userId ?? null,
        sessionId: sessionId ?? null,
        updatedAt: new Date(),
      })
      .returning();
    existingCart = newCart;
  }

  return existingCart;
}

/**
 * Guest cart lines must match `cart_session_id` cookie; user carts must match `ctx.user.id`.
 */
function assertCallerOwnsCartLine(ctx: {
  user?: { id: string } | null;
  guestCartSessionId?: string | undefined;
  lineCart: { userId: string | null; sessionId: string | null };
}): boolean {
  const { userId, sessionId } = ctx.lineCart;
  if (userId) {
    return Boolean(ctx.user?.id && ctx.user.id === userId);
  }
  return Boolean(ctx.guestCartSessionId && sessionId === ctx.guestCartSessionId);
}

/**
 * Helper function to get cart with items and product details
 */
async function getCartWithItems(cartId: string) {
  const cartLines = await db.query.cartLine.findMany({
    where: eq(cartLine.cartId, cartId),
    with: {
      variant: {
        with: {
          product: true,
        },
      },
    },
  });

  const items = cartLines.map((line) => ({
    lineId: line.id,
    variantId: line.variantId,
    productId: line.variant.product.id,
    productTitle: line.variant.product.title,
    variantTitle: line.variant.title,
    quantity: line.quantity,
    unitPrice: line.price,
    totalPrice: line.price * line.quantity,
    image: line.variant.product.baseImage,
    attributes: line.variant.attributes,
  }));

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return {
    items,
    itemCount,
    subtotal,
  };
}

/**
 * Helper function to check and reserve inventory
 */
async function reserveInventory(variantId: string, quantity: number, userId?: string, warehouseId?: string | null) {
  const result = await db.transaction(async (tx) => {
    const inventory = await getInventoryForVariantAndWarehouse(tx, {
      variantId,
      warehouseId: warehouseId ?? null,
    });

    if (!inventory) {
      throw new Error("Inventory not found for this variant");
    }

    const availableQuantity = inventory.quantity - inventory.reserved;

    if (availableQuantity < quantity) {
      throw new Error(`Insufficient inventory. Only ${availableQuantity} items available`);
    }

    const reservationId = uuidv4();

    await tx.insert(inventoryReservation).values({
      id: reservationId,
      inventoryId: inventory.id,
      warehouseId: inventory.warehouseId,
      userId: userId || null,
      quantity,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      createdAt: new Date(),
    });

    await applyInventoryDelta(tx, {
      inventoryId: inventory.id,
      reservedDelta: quantity,
      type: "order",
      warehouseId: inventory.warehouseId,
      variantId: inventory.variantId,
      orderId: null,
      refundId: null,
      reason: "Cart reservation",
      adjustedBy: userId ?? null,
    });

    return reservationId;
  });

  return result;
}

/**
 * Helper function to release inventory reservation
 */
async function releaseReservation(inventoryId: string, quantity: number) {
  await db.transaction(async (tx) => {
    const inventory = await tx.query.inventoryItem.findFirst({
      where: eq(inventoryItem.id, inventoryId),
    });

    if (!inventory) return;

    const releaseQuantity = Math.min(quantity, inventory.reserved);

    if (releaseQuantity <= 0) return;

    await applyInventoryDelta(tx, {
      inventoryId: inventory.id,
      reservedDelta: -releaseQuantity,
      type: "order",
      warehouseId: inventory.warehouseId,
      variantId: inventory.variantId,
      orderId: null,
      refundId: null,
      reason: "Cart reservation released",
      adjustedBy: null,
    });
  });
}

export const cartRouter = createTRPCRouter({
  /**
   * Get cart: authenticated callers use their user id; guests use `cart_session_id` cookie only.
   */
  get: publicProcedure
    .input(cartContract.get.input)
    .output(cartContract.get.output)
    .query(async ({ ctx }) => {
      try {
        const userId = ctx.user?.id;
        const sessionId = ctx.guestCartSessionId;

        if (!userId && !sessionId) {
          return API_RESPONSE(STATUS.FAILED, MESSAGE.CART.GET.FAILED, null);
        }

        const cartData = await db.query.cart.findFirst({
          where: userId ? eq(cart.userId, userId) : eq(cart.sessionId, sessionId!),
        });

        if (!cartData) {
          return API_RESPONSE(STATUS.FAILED, MESSAGE.CART.GET.FAILED, null);
        }

        const { items, itemCount, subtotal } = await getCartWithItems(cartData.id);

        return API_RESPONSE(STATUS.SUCCESS, MESSAGE.CART.GET.SUCCESS, {
          ...cartData,
          items,
          itemCount,
          subtotal,
          updatedAt: cartData.updatedAt || new Date(),
        });
      } catch (err) {
        debugError("CART:GET:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, MESSAGE.CART.GET.ERROR, null, err as Error);
      }
    }),

  /**
   * Get authenticated user's cart
   */
  getUserCart: customerProcedure
    .input(cartContract.getUserCart.input)
    .output(cartContract.getUserCart.output)
    .query(async ({ ctx }) => {
      try {
        const userId = ctx.user.id;

        // Find or create cart for user
        let cartData = await db.query.cart.findFirst({
          where: eq(cart.userId, userId),
        });

        if (!cartData) {
          const [newCart] = await db
            .insert(cart)
            .values({
              id: uuidv4(),
              userId,
              sessionId: null,
              updatedAt: new Date(),
            })
            .returning();
          cartData = newCart;
        }

        const { items, itemCount, subtotal } = await getCartWithItems(cartData.id);

        return API_RESPONSE(STATUS.SUCCESS, MESSAGE.CART.GET_USER_CART.SUCCESS, {
          ...cartData,
          items,
          itemCount,
          subtotal,
          updatedAt: cartData.updatedAt || new Date(),
        });
      } catch (err) {
        debugError("CART:GET_USER_CART:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, MESSAGE.CART.GET_USER_CART.ERROR, null, err as Error);
      }
    }),

  /**
   * Add item to cart
   */
  add: publicProcedure
    .input(cartContract.add.input)
    .output(cartContract.add.output)
    .mutation(async ({ input, ctx }) => {
      try {
        const { variantId, quantity, sessionId: bodySessionId, warehouseId } = input.body;
        const userId = ctx.user?.id;
        const cookieSessionId = ctx.guestCartSessionId;

        if (!userId) {
          if (!cookieSessionId) {
            return API_RESPONSE(STATUS.FAILED, "Guest cart requires cart_session_id cookie", null);
          }
          if (bodySessionId && bodySessionId !== cookieSessionId) {
            return API_RESPONSE(STATUS.FAILED, "Session mismatch", null);
          }
        }

        // Get variant details
        const variant = await db.query.productVariant.findFirst({
          where: eq(productVariant.id, variantId),
          with: {
            product: true,
          },
        });

        if (!variant) {
          return API_RESPONSE(STATUS.FAILED, "Product variant not found", null);
        }

        // Calculate price based on base price and modifier
        let unitPrice = variant.product.basePrice;
        if (variant.priceModifierType && variant.priceModifierValue) {
          const modifierValue = Number(variant.priceModifierValue);
          if (variant.priceModifierType === "flat_increase") {
            unitPrice += modifierValue;
          } else if (variant.priceModifierType === "flat_decrease") {
            unitPrice -= modifierValue;
          } else if (variant.priceModifierType === "percent_increase") {
            unitPrice += unitPrice * (modifierValue / 100);
          } else if (variant.priceModifierType === "percent_decrease") {
            unitPrice -= unitPrice * (modifierValue / 100);
          }
        }

        // Reserve inventory (warehouse-aware when warehouseId is provided)
        try {
          await reserveInventory(variantId, quantity, userId, warehouseId);
        } catch (inventoryErr) {
          return API_RESPONSE(STATUS.FAILED, (inventoryErr as Error).message, null);
        }

        const cartData = userId
          ? await getOrCreateCart({ userId })
          : await getOrCreateCart({ sessionId: cookieSessionId! });

        // Check if item already exists in cart
        const existingLine = await db.query.cartLine.findFirst({
          where: and(eq(cartLine.cartId, cartData.id), eq(cartLine.variantId, variantId)),
        });

        if (existingLine) {
          // Update quantity
          const [updatedLine] = await db
            .update(cartLine)
            .set({
              quantity: existingLine.quantity + quantity,
            })
            .where(eq(cartLine.id, existingLine.id))
            .returning();

          return API_RESPONSE(STATUS.SUCCESS, MESSAGE.CART.ADD_ITEM.SUCCESS, updatedLine);
        }

        // Create new cart line
        const [newLine] = await db
          .insert(cartLine)
          .values({
            id: uuidv4(),
            cartId: cartData.id,
            variantId,
            quantity,
            price: unitPrice,
          })
          .returning();

        // Update cart timestamp
        await db.update(cart).set({ updatedAt: new Date() }).where(eq(cart.id, cartData.id));

        return API_RESPONSE(STATUS.SUCCESS, MESSAGE.CART.ADD_ITEM.SUCCESS, newLine);
      } catch (err) {
        debugError("CART:ADD:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, MESSAGE.CART.ADD_ITEM.ERROR, null, err as Error);
      }
    }),

  /**
   * Update cart item quantity
   */
  update: publicProcedure
    .input(cartContract.update.input)
    .output(cartContract.update.output)
    .mutation(async ({ input, ctx }) => {
      try {
        const { lineId } = input.params;
        const { quantity } = input.body;

        const line = await db.query.cartLine.findFirst({
          where: eq(cartLine.id, lineId),
          with: {
            cart: true,
          },
        });

        if (!line) {
          return API_RESPONSE(STATUS.FAILED, MESSAGE.CART.UPDATE_ITEM.FAILED, null);
        }

        if (
          !assertCallerOwnsCartLine({
            user: ctx.user,
            guestCartSessionId: ctx.guestCartSessionId,
            lineCart: { userId: line.cart.userId, sessionId: line.cart.sessionId },
          })
        ) {
          return API_RESPONSE(STATUS.FAILED, "Unauthorized", null);
        }

        const userId = ctx.user?.id;

        if (quantity === 0) {
          // Release reservation before deleting
          const inventory = await db.query.inventoryItem.findFirst({
            where: eq(inventoryItem.variantId, line.variantId),
          });
          if (inventory) {
            await releaseReservation(inventory.id, line.quantity);
          }

          // Remove item
          await db.delete(cartLine).where(eq(cartLine.id, lineId));

          // Update cart timestamp
          await db.update(cart).set({ updatedAt: new Date() }).where(eq(cart.id, line.cartId));

          return API_RESPONSE(STATUS.SUCCESS, MESSAGE.CART.REMOVE_ITEM.SUCCESS, null);
        }

        // Handle quantity change
        const diff = quantity - line.quantity;
        if (diff !== 0) {
          if (diff > 0) {
            const inventory = await db.query.inventoryItem.findFirst({
              where: (inv, { and, eq, isNull }) => and(eq(inv.variantId, line.variantId), isNull(inv.deletedAt)),
            });

            if (!inventory) {
              return API_RESPONSE(STATUS.FAILED, "Inventory not found", null);
            }

            // Reserve more
            const availableQuantity = inventory.quantity - inventory.reserved;
            if (availableQuantity < diff) {
              return API_RESPONSE(
                STATUS.FAILED,
                `Insufficient inventory. Only ${availableQuantity} items available`,
                null,
              );
            }
            await reserveInventory(line.variantId, diff, userId);
          } else {
            const inventory = await db.query.inventoryItem.findFirst({
              where: eq(inventoryItem.variantId, line.variantId),
            });

            // Release some
            if (inventory) {
              await releaseReservation(inventory.id, Math.abs(diff));
            }
          }
        }

        // Update quantity
        const [updatedLine] = await db.update(cartLine).set({ quantity }).where(eq(cartLine.id, lineId)).returning();

        // Update cart timestamp
        await db.update(cart).set({ updatedAt: new Date() }).where(eq(cart.id, line.cartId));

        return API_RESPONSE(STATUS.SUCCESS, MESSAGE.CART.UPDATE_ITEM.SUCCESS, updatedLine);
      } catch (err) {
        debugError("CART:UPDATE:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, MESSAGE.CART.UPDATE_ITEM.ERROR, null, err as Error);
      }
    }),

  /**
   * Remove item from cart
   */
  remove: publicProcedure
    .input(cartContract.remove.input)
    .output(cartContract.remove.output)
    .mutation(async ({ input, ctx }) => {
      try {
        const { lineId } = input.params;

        const line = await db.query.cartLine.findFirst({
          where: eq(cartLine.id, lineId),
          with: {
            cart: true,
          },
        });

        if (!line) {
          return API_RESPONSE(STATUS.FAILED, MESSAGE.CART.REMOVE_ITEM.FAILED, null);
        }

        if (
          !assertCallerOwnsCartLine({
            user: ctx.user,
            guestCartSessionId: ctx.guestCartSessionId,
            lineCart: { userId: line.cart.userId, sessionId: line.cart.sessionId },
          })
        ) {
          return API_RESPONSE(STATUS.FAILED, "Unauthorized", null);
        }

        // Release reservation before deleting
        const inventory = await db.query.inventoryItem.findFirst({
          where: eq(inventoryItem.variantId, line.variantId),
        });
        if (inventory) {
          await releaseReservation(inventory.id, line.quantity);
        }

        // Remove item
        await db.delete(cartLine).where(eq(cartLine.id, lineId));

        // Update cart timestamp
        await db.update(cart).set({ updatedAt: new Date() }).where(eq(cart.id, line.cartId));

        return API_RESPONSE(STATUS.SUCCESS, MESSAGE.CART.REMOVE_ITEM.SUCCESS, { id: lineId });
      } catch (err) {
        debugError("CART:REMOVE:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, MESSAGE.CART.REMOVE_ITEM.ERROR, null, err as Error);
      }
    }),

  /**
   * Clear entire cart
   */
  clear: publicProcedure
    .input(cartContract.clear.input)
    .output(cartContract.clear.output)
    .mutation(async ({ input, ctx }) => {
      try {
        const userId = ctx.user?.id;
        const cookieSession = ctx.guestCartSessionId;
        const bodySessionId = input.body?.sessionId;

        if (!userId && !cookieSession) {
          return API_RESPONSE(STATUS.FAILED, "Guest cart requires cart_session_id cookie", null);
        }
        if (!userId && bodySessionId && bodySessionId !== cookieSession) {
          return API_RESPONSE(STATUS.FAILED, "Session mismatch", null);
        }

        const cartData = await db.query.cart.findFirst({
          where: userId ? eq(cart.userId, userId) : eq(cart.sessionId, cookieSession!),
        });

        if (!cartData) {
          return API_RESPONSE(STATUS.SUCCESS, MESSAGE.CART.CLEAR_CART.SUCCESS, { success: true });
        }

        // Release reservations for all lines before clearing
        const lines = await db.query.cartLine.findMany({
          where: eq(cartLine.cartId, cartData.id),
        });
        for (const line of lines) {
          const inventory = await db.query.inventoryItem.findFirst({
            where: eq(inventoryItem.variantId, line.variantId),
          });
          if (inventory) {
            await releaseReservation(inventory.id, line.quantity);
          }
        }

        // Delete all cart lines
        await db.delete(cartLine).where(eq(cartLine.cartId, cartData.id));

        // Update cart timestamp
        await db.update(cart).set({ updatedAt: new Date() }).where(eq(cart.id, cartData.id));

        return API_RESPONSE(STATUS.SUCCESS, MESSAGE.CART.CLEAR_CART.SUCCESS, { success: true });
      } catch (err) {
        debugError("CART:CLEAR:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, MESSAGE.CART.CLEAR_CART.ERROR, null, err as Error);
      }
    }),

  /**
   * Get cart totals
   */
  getTotals: customerProcedure
    .input(cartContract.getTotals.input)
    .output(cartContract.getTotals.output)
    .query(async ({ ctx }) => {
      try {
        const userId = ctx.user.id;

        const cartData = await db.query.cart.findFirst({
          where: eq(cart.userId, userId),
        });

        if (!cartData) {
          return API_RESPONSE(STATUS.SUCCESS, "Cart totals retrieved", {
            itemCount: 0,
            subtotal: 0,
          });
        }

        const { itemCount, subtotal } = await getCartWithItems(cartData.id);

        return API_RESPONSE(STATUS.SUCCESS, "Cart totals retrieved", {
          itemCount,
          subtotal,
        });
      } catch (err) {
        debugError("CART:GET_TOTALS:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error retrieving cart totals", null, err as Error);
      }
    }),

  /**
   * Merge guest cart to user cart (called on login)
   */
  merge: customerProcedure
    .input(cartContract.merge.input)
    .output(cartContract.merge.output)
    .mutation(async ({ input, ctx }) => {
      try {
        const userId = ctx.user.id;
        const { sessionId } = input.body;

        if (!ctx.guestCartSessionId || sessionId !== ctx.guestCartSessionId) {
          return API_RESPONSE(STATUS.FAILED, "Guest session mismatch — merge only the cart from this browser", null);
        }

        const guestCart = await db.query.cart.findFirst({
          where: eq(cart.sessionId, sessionId),
          with: {
            lines: true,
          },
        });

        if (!guestCart || guestCart.lines.length === 0) {
          // Just return user's cart
          const userCartData = await db.query.cart.findFirst({
            where: eq(cart.userId, userId),
          });

          if (!userCartData) {
            // Create new cart for user
            const [newCart] = await db
              .insert(cart)
              .values({
                id: uuidv4(),
                userId,
                sessionId: null,
                updatedAt: new Date(),
              })
              .returning();

            return API_RESPONSE(STATUS.SUCCESS, "Cart merged successfully", {
              ...newCart,
              items: [],
              itemCount: 0,
              subtotal: 0,
              updatedAt: new Date(),
            });
          }

          const { items, itemCount, subtotal } = await getCartWithItems(userCartData.id);
          return API_RESPONSE(STATUS.SUCCESS, "Cart merged successfully", {
            ...userCartData,
            items,
            itemCount,
            subtotal,
            updatedAt: userCartData.updatedAt || new Date(),
          });
        }

        // Find or create user cart
        let userCart = await db.query.cart.findFirst({
          where: eq(cart.userId, userId),
        });

        if (!userCart) {
          // Convert guest cart to user cart
          await db.update(cart).set({ userId, sessionId: null }).where(eq(cart.id, guestCart.id));

          userCart = guestCart;
        } else {
          // Merge items from guest cart to user cart
          for (const guestLine of guestCart.lines) {
            const existingLine = await db.query.cartLine.findFirst({
              where: and(eq(cartLine.cartId, userCart.id), eq(cartLine.variantId, guestLine.variantId)),
            });

            if (existingLine) {
              // Update quantity
              await db
                .update(cartLine)
                .set({ quantity: existingLine.quantity + guestLine.quantity })
                .where(eq(cartLine.id, existingLine.id));
            } else {
              // Move line to user cart
              await db.update(cartLine).set({ cartId: userCart.id }).where(eq(cartLine.id, guestLine.id));
            }
          }

          // Delete guest cart
          await db.delete(cart).where(eq(cart.id, guestCart.id));
        }

        // Update cart timestamp
        await db.update(cart).set({ updatedAt: new Date() }).where(eq(cart.id, userCart.id));

        const { items, itemCount, subtotal } = await getCartWithItems(userCart.id);

        return API_RESPONSE(STATUS.SUCCESS, "Cart merged successfully", {
          ...userCart,
          items,
          itemCount,
          subtotal,
          updatedAt: new Date(),
        });
      } catch (err) {
        debugError("CART:MERGE:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error merging cart", null, err as Error);
      }
    }),
});
