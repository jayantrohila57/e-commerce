import { and, eq, ilike, inArray, isNotNull, isNull, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { adminProcedure, createTRPCRouter, customerProcedure, staffProcedure } from "@/core/api/api.methods";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { db } from "@/core/db/db";
import {
  cart,
  cartLine,
  inventoryItem,
  order,
  orderItem,
  shippingMethod,
  shippingProvider,
  shippingRateRule,
  user as userTable,
} from "@/core/db/db.schema";
import { notifyLowStock, notifyOrderStatusChange } from "@/shared/components/mail/notification.service";
import { MESSAGE, STATUS } from "@/shared/config/api.config";
import { API_RESPONSE } from "@/shared/config/api.utils";
import { siteConfig } from "@/shared/config/site";
import { buildPagination, buildPaginationMeta } from "@/shared/schema";
import { debugError } from "@/shared/utils/lib/logger.utils";
import { type Order, type OrderStatus, orderContract } from "./order.schema";

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
            user: true,
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
          orderBy: (orderTable, { desc }) => [desc(orderTable.placedAt)],
          with: {
            items: true,
            user: true,
          },
        });

        return API_RESPONSE(STATUS.SUCCESS, "Orders retrieved successfully", data);
      } catch (err) {
        debugError("ORDER:GET_MANY:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error retrieving orders", [], err as Error);
      }
    }),

  /**
   * Admin/staff: list all orders with pagination & optional filters
   */
  getManyAdmin: adminProcedure
    .input(orderContract.getManyAdmin.input)
    .output(orderContract.getManyAdmin.output)
    .query(async ({ input }) => {
      try {
        const query = {
          page: 1,
          limit: 20,
          sortOrder: "desc" as const,
          status: undefined as OrderStatus | undefined,
          customerType: undefined as "registered" | "guest" | undefined,
          q: undefined as string | undefined,
          shippingProviderPresence: undefined as "assigned" | "unassigned" | undefined,
          shippingMethodPresence: undefined as "assigned" | "unassigned" | undefined,
          shippingZonePresence: undefined as "assigned" | "unassigned" | undefined,
          warehousePresence: undefined as "assigned" | "unassigned" | undefined,
          ...input.query,
        };
        const {
          status,
          q,
          customerType,
          shippingProviderPresence,
          shippingMethodPresence,
          shippingZonePresence,
          warehousePresence,
        } = query;

        const pageInput = {
          page: query.page ?? 1,
          limit: query.limit ?? 20,
          sortBy: query.sortBy,
          sortOrder: query.sortOrder ?? "desc",
        };

        const paging = buildPagination(pageInput);
        const offset = paging.offset;
        const limit = paging.limit;

        // Build where conditions using drizzle top-level helpers
        const whereConditions = [
          status ? eq(order.status, status) : undefined,
          customerType === "registered" ? sql`${order.userId} IS NOT NULL` : undefined,
          customerType === "guest" ? sql`${order.userId} IS NULL` : undefined,
          q ? ilike(order.id, `%${q}%`) : undefined,
          shippingProviderPresence === "assigned" ? isNotNull(order.shippingProviderId) : undefined,
          shippingProviderPresence === "unassigned" ? isNull(order.shippingProviderId) : undefined,
          shippingMethodPresence === "assigned" ? isNotNull(order.shippingMethodId) : undefined,
          shippingMethodPresence === "unassigned" ? isNull(order.shippingMethodId) : undefined,
          shippingZonePresence === "assigned" ? isNotNull(order.shippingZoneId) : undefined,
          shippingZonePresence === "unassigned" ? isNull(order.shippingZoneId) : undefined,
          warehousePresence === "assigned" ? isNotNull(order.warehouseId) : undefined,
          warehousePresence === "unassigned" ? isNull(order.warehouseId) : undefined,
        ].filter((condition): condition is NonNullable<typeof condition> => Boolean(condition));

        const where = whereConditions.length ? and(...whereConditions) : undefined;

        const [{ count: totalRaw = 0 } = { count: 0 }] = await db
          .select({ count: sql<number>`count(*)` })
          .from(order)
          .where(where);
        const total = Number(totalRaw ?? 0);

        const data = await db.query.order.findMany({
          where,
          orderBy: (o, { desc }) => [desc(o.placedAt)],
          limit,
          offset,
          with: {
            user: true,
          },
        });

        const metaPagination = buildPaginationMeta(total, pageInput);

        return {
          status: STATUS.SUCCESS,
          message: "Orders retrieved successfully",
          data,
          meta: {
            count: total,
            pagination: metaPagination,
          },
        };
      } catch (err) {
        debugError("ORDER:GET_MANY_ADMIN:ERROR", err);
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
        const { cartId, sessionId, shippingAddress, billingAddress, notes, shippingProviderId, shippingMethodId } =
          input.body;

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

        // 2. Validate shipping method + provider and resolve shipping zone + rate
        const methodRow = await db.query.shippingMethod.findFirst({
          where: eq(shippingMethod.id, shippingMethodId),
          with: {
            provider: true,
            rates: {
              with: {
                zone: true,
              },
            },
          },
        });

        if (!methodRow || !methodRow.isActive) {
          return API_RESPONSE(STATUS.FAILED, "Selected delivery method is not available", null);
        }

        if (!methodRow.provider || !methodRow.provider.isActive || methodRow.provider.id !== shippingProviderId) {
          return API_RESPONSE(STATUS.FAILED, "Selected delivery provider is not available", null);
        }

        const normalizedCountry = shippingAddress.country.toUpperCase();
        const normalizedRegion = shippingAddress.state.toUpperCase();

        const matchingRate =
          methodRow.rates.find(
            (rate) =>
              rate.isActive &&
              rate.zone.countryCode.toUpperCase() === normalizedCountry &&
              (rate.zone.regionCode?.toUpperCase() === normalizedRegion || rate.zone.regionCode === null),
          ) ?? null;

        if (!matchingRate) {
          return API_RESPONSE(
            STATUS.FAILED,
            "No delivery rate is configured for the selected address and method",
            null,
          );
        }

        const shippingZoneId = matchingRate.zoneId;
        const shippingTotal = matchingRate.price;

        // 3. Start transaction
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

          // 4. Create Order
          const [newOrder] = await tx
            .insert(order)
            .values({
              id: orderId,
              userId: userId || null,
              status: "pending",
              subtotal,
              shippingTotal,
              grandTotal: subtotal + shippingTotal,
              currency: "INR",
              shippingProviderId,
              shippingMethodId,
              shippingZoneId,
              shippingAddress: shippingAddress,
              billingAddress: billingAddress || shippingAddress,
              notes: notes || null,
              placedAt: new Date(),
              createdAt: new Date(),
              updatedAt: new Date(),
            })
            .returning();

          // 5. Create Order Items
          await tx.insert(orderItem).values(orderItemsData);

          // 6. Update Inventory (Deduct reserved, decrease quantity)
          for (const item of orderItemsData) {
            await tx
              .update(inventoryItem)
              .set({
                quantity: sql`${inventoryItem.quantity} - ${item.quantity}`,
                reserved: sql`GREATEST(0, ${inventoryItem.reserved} - ${item.quantity})`,
              })
              .where(eq(inventoryItem.variantId, item.variantId));
          }

          // 7. Clear Cart
          await tx.delete(cartLine).where(eq(cartLine.cartId, cartData.id));
          await tx.update(cart).set({ updatedAt: new Date() }).where(eq(cart.id, cartData.id));

          return { ...newOrder, items: orderItemsData };
        });

        // 8. Upgrade role from user -> customer on first checkout
        const currentRole = normalizeRole(ctx.user.role);
        if (currentRole === APP_ROLE.USER) {
          await db.update(userTable).set({ role: APP_ROLE.CUSTOMER }).where(eq(userTable.id, userId));
        }

        // 8. Low stock alerts (fire-and-forget)
        const variantIds = [...new Set(result.items.map((i) => i.variantId))];
        if (variantIds.length > 0) {
          const inventories = await db.query.inventoryItem.findMany({
            where: inArray(inventoryItem.variantId, variantIds),
          });
          for (const inv of inventories) {
            if (inv.quantity > 10) continue;
            const item = result.items.find((i) => i.variantId === inv.variantId);
            if (!item) continue;
            notifyLowStock({
              variantId: inv.variantId,
              currentStock: inv.quantity,
              productName: item.productTitle,
              variantTitle: item.variantTitle,
              sku: inv.sku ?? undefined,
            }).catch((err) => debugError("ORDER:CREATE:LOW_STOCK_ALERT:ERROR", err));
          }
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
    .mutation(async ({ input }) => {
      try {
        const { id } = input.params;
        const { status: newStatus } = input.body;

        const existingOrder = await db.query.order.findFirst({
          where: eq(order.id, id),
          with: { user: true },
        });
        if (!existingOrder) {
          return API_RESPONSE(STATUS.FAILED, "Order not found", null);
        }
        const oldStatus = existingOrder.status;

        const [updatedOrder] = await db
          .update(order)
          .set({
            status: newStatus,
            updatedAt: new Date(),
          })
          .where(eq(order.id, id))
          .returning();

        if (!updatedOrder) {
          return API_RESPONSE(STATUS.FAILED, "Order not found", null);
        }

        if (oldStatus !== newStatus && existingOrder.userId) {
          await notifyOrderStatusChange(id, oldStatus, newStatus);
        }

        return API_RESPONSE(STATUS.SUCCESS, MESSAGE.ORDER.UPDATE.SUCCESS, updatedOrder);
      } catch (err) {
        debugError("ORDER:UPDATE_STATUS:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error updating order status", null, err as Error);
      }
    }),
});
