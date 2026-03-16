import { and, desc, eq, ilike, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { createTRPCRouter, customerProcedure, publicProcedure, staffProcedure } from "@/core/api/api.methods";
import { db } from "@/core/db/db";
import { order, shipment } from "@/core/db/db.schema";
import { buildPagination } from "@/core/db/utils/query.utils";
import { notifyOrderStatusChange, notifyShipmentUpdate } from "@/shared/components/mail/notification.service";
import { MESSAGE, STATUS } from "@/shared/config/api.config";
import { API_RESPONSE } from "@/shared/config/api.utils";
import { buildPaginationMeta } from "@/shared/schema";
import { debugError } from "@/shared/utils/lib/logger.utils";
import { shipmentContract } from "./shipment.schema";

export const shipmentRouter = createTRPCRouter({
  /**
   * Get a single shipment by ID (staff only)
   */
  get: staffProcedure
    .input(shipmentContract.get.input)
    .output(shipmentContract.get.output)
    .query(async ({ input }) => {
      try {
        const { id } = input.params;
        const data = await db.query.shipment.findFirst({
          where: eq(shipment.id, id),
        });
        if (!data) {
          return API_RESPONSE(STATUS.FAILED, MESSAGE.SHIPMENT.GET.FAILED, null);
        }
        return API_RESPONSE(STATUS.SUCCESS, MESSAGE.SHIPMENT.GET.SUCCESS, data);
      } catch (err) {
        debugError("SHIPMENT:GET:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, MESSAGE.SHIPMENT.GET.ERROR, null, err as Error);
      }
    }),

  /**
   * List all shipments with pagination (staff only)
   */
  getMany: staffProcedure
    .input(shipmentContract.getMany.input)
    .output(shipmentContract.getMany.output)
    .query(async ({ input }) => {
      try {
        const query = {
          page: 1,
          limit: 20,
          sortOrder: "desc" as const,
          sortBy: undefined as string | undefined,
          status: undefined as (typeof shipment.$inferSelect)["status"] | undefined,
          carrier: undefined as string | undefined,
          orderId: undefined as string | undefined,
          ...input?.query,
        };

        const { offset, limit } = buildPagination({
          page: query.page ?? 1,
          limit: query.limit ?? 20,
          sortOrder: query.sortOrder ?? "desc",
          sortBy: query.sortBy,
        });

        const whereConditions = [
          query.status ? eq(shipment.status, query.status) : undefined,
          query.carrier ? ilike(shipment.carrier, `%${query.carrier}%`) : undefined,
          query.orderId ? eq(shipment.orderId, query.orderId) : undefined,
        ].filter((c): c is NonNullable<typeof c> => Boolean(c));

        const where = whereConditions.length ? and(...whereConditions) : undefined;

        const [{ count: totalRaw = 0 } = { count: 0 }] = await db
          .select({ count: sql<number>`count(*)` })
          .from(shipment)
          .where(where);
        const total = Number(totalRaw ?? 0);

        const data = await db.query.shipment.findMany({
          where,
          orderBy: [desc(shipment.createdAt)],
          limit: Math.min(limit, 100),
          offset,
        });

        const metaPagination = buildPaginationMeta(total, {
          page: query.page ?? 1,
          limit: query.limit ?? 20,
          sortBy: query.sortBy,
          sortOrder: query.sortOrder ?? "desc",
        });

        return {
          status: STATUS.SUCCESS,
          message: MESSAGE.SHIPMENT.GET_MANY.SUCCESS,
          data,
          meta: {
            count: total,
            pagination: metaPagination,
          },
        };
      } catch (err) {
        debugError("SHIPMENT:GET_MANY:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, MESSAGE.SHIPMENT.GET_MANY.ERROR, [], err as Error);
      }
    }),

  /**
   * Look up shipment by tracking number (public, for customer tracking)
   */
  getByTracking: publicProcedure
    .input(shipmentContract.getByTracking.input)
    .output(shipmentContract.getByTracking.output)
    .query(async ({ input }) => {
      try {
        const { trackingNumber } = input.params;
        const data = await db.query.shipment.findFirst({
          where: eq(shipment.trackingNumber, trackingNumber),
        });
        return API_RESPONSE(
          STATUS.SUCCESS,
          data ? MESSAGE.SHIPMENT.GET.SUCCESS : MESSAGE.SHIPMENT.GET_MANY.FAILED,
          data ?? null,
        );
      } catch (err) {
        debugError("SHIPMENT:GET_BY_TRACKING:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, MESSAGE.SHIPMENT.GET.ERROR, null, err as Error);
      }
    }),

  /**
   * Create a shipment for an order
   *
   * Business rules:
   * - Order must exist
   * - Order must be paid
   * - Only one shipment per order is allowed for now
   */
  create: staffProcedure
    .input(shipmentContract.create.input)
    .output(shipmentContract.create.output)
    .mutation(async ({ input }) => {
      try {
        const { orderId, trackingNumber, carrier, notes, estimatedDeliveryAt, shippingRate, weight } = input.body;

        const orderData = await db.query.order.findFirst({
          where: eq(order.id, orderId),
        });

        if (!orderData) {
          return API_RESPONSE(STATUS.FAILED, MESSAGE.SHIPMENT.CREATE.FAILED, null);
        }

        // Only allow creating shipments for paid orders
        if (orderData.status !== "paid") {
          return API_RESPONSE(STATUS.FAILED, "Shipments can only be created for paid orders.", null);
        }

        // Prevent multiple shipments per order (current UX assumes 1:1)
        const existingShipment = await db.query.shipment.findFirst({
          where: eq(shipment.orderId, orderId),
        });

        if (existingShipment) {
          return API_RESPONSE(STATUS.FAILED, "A shipment already exists for this order.", existingShipment);
        }

        const [newShipment] = await db
          .insert(shipment)
          .values({
            id: uuidv4(),
            orderId,
            trackingNumber: trackingNumber ?? null,
            carrier: carrier ?? null,
            notes: notes ?? null,
            estimatedDeliveryAt: estimatedDeliveryAt ?? null,
            shippingRate: shippingRate ?? null,
            weight: weight ?? null,
            status: "pending",
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();

        if (orderData.userId && newShipment) {
          await notifyShipmentUpdate(newShipment.id);
        }

        return API_RESPONSE(STATUS.SUCCESS, MESSAGE.SHIPMENT.CREATE.SUCCESS, newShipment);
      } catch (err) {
        debugError("SHIPMENT:CREATE:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, MESSAGE.SHIPMENT.CREATE.ERROR, null, err as Error);
      }
    }),

  /**
   * Update shipment status
   *
   * Also keeps the parent order status in sync
   * and triggers shipment notification emails.
   */
  updateStatus: staffProcedure
    .input(shipmentContract.updateStatus.input)
    .output(shipmentContract.updateStatus.output)
    .mutation(async ({ input }) => {
      try {
        const { id } = input.params;
        const { status, trackingNumber, carrier } = input.body;

        const updateData: Record<string, unknown> = {
          status,
          updatedAt: new Date(),
        };

        if (trackingNumber) updateData.trackingNumber = trackingNumber;
        if (carrier) updateData.carrier = carrier;
        if (status === "in_transit" || status === "picked_up") {
          updateData.shippedAt = updateData.shippedAt ?? new Date();
        }
        if (status === "delivered") {
          updateData.deliveredAt = updateData.deliveredAt ?? new Date();
        }

        const [updatedShipment] = await db.update(shipment).set(updateData).where(eq(shipment.id, id)).returning();

        if (!updatedShipment) {
          return API_RESPONSE(STATUS.FAILED, MESSAGE.SHIPMENT.UPDATE.FAILED, null);
        }

        // Keep order status aligned with shipment state and notify if it changes
        if (updatedShipment.orderId) {
          const existingOrder = await db.query.order.findFirst({
            where: eq(order.id, updatedShipment.orderId),
          });

          if (existingOrder) {
            const oldStatus = existingOrder.status;
            let newStatus = oldStatus;

            if (status === "delivered") {
              newStatus = "delivered";
            } else if (status === "in_transit" || status === "picked_up") {
              newStatus = "shipped";
            } else if (status === "exception" || status === "returned") {
              // For now, treat exception/returned shipments as a terminal problem state
              // and move the order to cancelled if it is not already completed.
              if (oldStatus !== "delivered") {
                newStatus = "cancelled";
              }
            }

            if (newStatus !== oldStatus) {
              const [updatedOrder] = await db
                .update(order)
                .set({ status: newStatus, updatedAt: new Date() })
                .where(eq(order.id, updatedShipment.orderId))
                .returning();

              if (updatedOrder && existingOrder.userId) {
                await notifyOrderStatusChange(updatedOrder.id, oldStatus, newStatus);
              }
            }
          }
        }

        if (updatedShipment.orderId) {
          await notifyShipmentUpdate(updatedShipment.id);
        }

        return API_RESPONSE(STATUS.SUCCESS, MESSAGE.SHIPMENT.UPDATE.SUCCESS, updatedShipment);
      } catch (err) {
        debugError("SHIPMENT:UPDATE_STATUS:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, MESSAGE.SHIPMENT.UPDATE.ERROR, null, err as Error);
      }
    }),

  /**
   * Get shipments for an order
   */
  getByOrder: customerProcedure
    .input(shipmentContract.getByOrder.input)
    .output(shipmentContract.getByOrder.output)
    .query(async ({ input }) => {
      try {
        const { orderId } = input.params;

        const data = await db.query.shipment.findMany({
          where: eq(shipment.orderId, orderId),
          orderBy: (shipment, { desc }) => [desc(shipment.createdAt)],
        });

        return API_RESPONSE(STATUS.SUCCESS, MESSAGE.SHIPMENT.GET_ORDER_SHIPMENTS.SUCCESS, data);
      } catch (err) {
        debugError("SHIPMENT:GET_BY_ORDER:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error retrieving shipments", [], err as Error);
      }
    }),
});
