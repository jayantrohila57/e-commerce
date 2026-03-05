import { desc, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { createTRPCRouter, customerProcedure, staffProcedure } from "@/core/api/api.methods";
import { db } from "@/core/db/db";
import { order, shipment } from "@/core/db/db.schema";
import { MESSAGE, STATUS } from "@/shared/config/api.config";
import { API_RESPONSE } from "@/shared/config/api.utils";
import { debugError } from "@/shared/utils/lib/logger.utils";
import { shipmentContract } from "./shipment.schema";

export const shipmentRouter = createTRPCRouter({
  /**
   * Create a shipment for an order
   */
  create: staffProcedure
    .input(shipmentContract.create.input)
    .output(shipmentContract.create.output)
    .mutation(async ({ input }) => {
      try {
        const { orderId, trackingNumber, carrier } = input.body;

        const orderData = await db.query.order.findFirst({
          where: eq(order.id, orderId),
        });

        if (!orderData) {
          return API_RESPONSE(STATUS.FAILED, "Order not found", null);
        }

        const [newShipment] = await db
          .insert(shipment)
          .values({
            id: uuidv4(),
            orderId,
            trackingNumber: trackingNumber || null,
            carrier: carrier || null,
            status: "pending",
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();

        return API_RESPONSE(STATUS.SUCCESS, "Shipment created", newShipment);
      } catch (err) {
        debugError("SHIPMENT:CREATE:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error creating shipment", null, err as Error);
      }
    }),

  /**
   * Update shipment status
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
        if (status === "in_transit") updateData.shippedAt = new Date();
        if (status === "delivered") updateData.deliveredAt = new Date();

        const [updatedShipment] = await db.update(shipment).set(updateData).where(eq(shipment.id, id)).returning();

        if (!updatedShipment) {
          return API_RESPONSE(STATUS.FAILED, "Shipment not found", null);
        }

        // If delivered, update order status
        if (status === "delivered") {
          await db
            .update(order)
            .set({ status: "delivered", updatedAt: new Date() })
            .where(eq(order.id, updatedShipment.orderId));
        } else if (status === "in_transit") {
          await db
            .update(order)
            .set({ status: "shipped", updatedAt: new Date() })
            .where(eq(order.id, updatedShipment.orderId));
        }

        return API_RESPONSE(STATUS.SUCCESS, "Shipment status updated", updatedShipment);
      } catch (err) {
        debugError("SHIPMENT:UPDATE_STATUS:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error updating shipment status", null, err as Error);
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

        return API_RESPONSE(STATUS.SUCCESS, "Shipments retrieved", data);
      } catch (err) {
        debugError("SHIPMENT:GET_BY_ORDER:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error retrieving shipments", [], err as Error);
      }
    }),
});
