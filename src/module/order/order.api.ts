import { and, eq, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { createTRPCRouter, customerProcedure, staffProcedure } from "@/core/api/api.methods";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { db } from "@/core/db/db";
import { cart, cartLine, inventoryItem, order, orderItem, user as userTable } from "@/core/db/db.schema";
import { MESSAGE, STATUS } from "@/shared/config/api.config";
import { API_RESPONSE } from "@/shared/config/api.utils";
import { debugError } from "@/shared/utils/lib/logger.utils";
import { type Order, orderContract } from "./order.schema";

export const orderRouter = createTRPCRouter({
  /**
   * Get order by ID
   */
  get: customerProcedure
    .input(orderContract.get.input)
    .output(orderContract.get.output)
    .query(async ({ input, ctx }) => {
      try {
        const userId = ctx.user.id;
        const { id } = input.params;

        const data = await db.query.order.findFirst({
          where: eq(order.id, id),
          with: {
            items: true,
          },
        });

        if (!data) {
          return API_RESPONSE(STATUS.FAILED, MESSAGE.ORDER.GET.FAILED, null);
        }

        // Verify ownership if order belongs to a user
        const role = normalizeRole(ctx.user.role);
        if (role === APP_ROLE.CUSTOMER && data.userId && data.userId !== userId) {
          return API_RESPONSE(STATUS.FAILED, "Unauthorized", null);
        }

        return API_RESPONSE(STATUS.SUCCESS, MESSAGE.ORDER.GET.SUCCESS, data);
      } catch (err) {
        debugError("ORDER:GET:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, MESSAGE.ORDER.GET.ERROR, null, err as Error);
      }
    }),

  /**
   * Get current user's orders
   */
  getMany: customerProcedure
    .input(orderContract.getMany.input)
    .output(orderContract.getMany.output)
    .query(async ({ ctx }) => {
      try {
        const userId = ctx.user.id;

        const role = normalizeRole(ctx.user.role);
        const data = await db.query.order.findMany({
          where: role === APP_ROLE.CUSTOMER ? eq(order.userId, userId) : undefined,
          orderBy: (order, { desc }) => [desc(order.placedAt)],
          with: {
            items: true,
          },
        });

        return API_RESPONSE(STATUS.SUCCESS, "Orders retrieved successfully", data);
      } catch (err) {
        debugError("ORDER:GET_MANY:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error retrieving orders", [], err as Error);
      }
    }),

  /**
   * Create order from cart
   */
  create: customerProcedure
    .input(orderContract.create.input)
    .output(orderContract.create.output)
    .mutation(async ({ input, ctx }) => {
      try {
        const userId = ctx.user.id;
        const { cartId, sessionId, shippingAddress, billingAddress, notes } = input.body;

        // 1. Get cart items
        const cartData = await db.query.cart.findFirst({
          where: cartId ? eq(cart.id, cartId) : sessionId ? eq(cart.sessionId, sessionId) : undefined,
          with: {
            lines: {
              with: {
                variant: {
                  with: {
                    product: true,
                  },
                },
              },
            },
          },
        });

        if (!cartData || cartData.lines.length === 0) {
          return API_RESPONSE(STATUS.FAILED, "Cart is empty", null);
        }

        // Verify cart ownership if applicable
        if (cartData.userId && cartData.userId !== userId) {
          return API_RESPONSE(STATUS.FAILED, "Unauthorized cart access", null);
        }

        if (!shippingAddress) {
          return API_RESPONSE(STATUS.FAILED, "Shipping address is required", null);
        }

        // 2. Start transaction
        const result = await db.transaction(async (tx) => {
          const orderId = uuidv4();
          let subtotal = 0;

          // Process each cart line
          const orderItemsData = cartData.lines.map((line) => {
            const lineTotal = line.price * line.quantity;
            subtotal += lineTotal;

            return {
              id: uuidv4(),
              orderId,
              variantId: line.variantId,
              productTitle: line.variant.product.title,
              variantTitle: line.variant.title,
              quantity: line.quantity,
              unitPrice: line.price,
              totalPrice: lineTotal,
              attributes: line.variant.attributes,
              createdAt: new Date(),
            };
          });

          // 3. Create Order
          const [newOrder] = await tx
            .insert(order)
            .values({
              id: orderId,
              userId: userId || null,
              status: "pending",
              subtotal,
              grandTotal: subtotal, // Basic subtotal for now
              currency: "INR",
              shippingAddress: shippingAddress,
              billingAddress: billingAddress || shippingAddress,
              notes: notes || null,
              placedAt: new Date(),
              createdAt: new Date(),
              updatedAt: new Date(),
            })
            .returning();

          // 4. Create Order Items
          await tx.insert(orderItem).values(orderItemsData);

          // 5. Update Inventory (Deduct reserved, decrease quantity)
          for (const item of orderItemsData) {
            await tx
              .update(inventoryItem)
              .set({
                quantity: sql`${inventoryItem.quantity} - ${item.quantity}`,
                reserved: sql`GREATEST(0, ${inventoryItem.reserved} - ${item.quantity})`,
              })
              .where(eq(inventoryItem.variantId, item.variantId));
          }

          // 6. Clear Cart
          await tx.delete(cartLine).where(eq(cartLine.cartId, cartData.id));
          await tx.update(cart).set({ updatedAt: new Date() }).where(eq(cart.id, cartData.id));

          return { ...newOrder, items: orderItemsData };
        });

        // 7. Upgrade role from user -> customer on first checkout
        const currentRole = normalizeRole(ctx.user.role);
        if (currentRole === APP_ROLE.USER) {
          await db.update(userTable).set({ role: APP_ROLE.CUSTOMER }).where(eq(userTable.id, userId));
        }

        return API_RESPONSE(STATUS.SUCCESS, MESSAGE.ORDER.CREATE.SUCCESS, result);
      } catch (err) {
        debugError("ORDER:CREATE:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error placing order", null, err as Error);
      }
    }),

  /**
   * Update order status (Admin only or system)
   */
  updateStatus: staffProcedure
    .input(orderContract.updateStatus.input)
    .output(orderContract.updateStatus.output)
    .mutation(async ({ input, ctx }) => {
      try {
        const { id } = input.params;
        const { status } = input.body;

        const [updatedOrder] = await db
          .update(order)
          .set({
            status,
            updatedAt: new Date(),
          })
          .where(eq(order.id, id))
          .returning();

        if (!updatedOrder) {
          return API_RESPONSE(STATUS.FAILED, "Order not found", null);
        }

        return API_RESPONSE(STATUS.SUCCESS, MESSAGE.ORDER.UPDATE.SUCCESS, updatedOrder);
      } catch (err) {
        debugError("ORDER:UPDATE_STATUS:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error updating order status", null, err as Error);
      }
    }),
});
