import { and, between, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { createTRPCRouter, staffProcedure } from "@/core/api/api.methods";
import { db } from "@/core/db/db";
import {
  inventoryAdjustmentEvent,
  inventoryItem,
  order,
  shipment,
  shippingMethod,
  shippingProvider,
} from "@/core/db/db.schema";
import { STATUS } from "@/shared/config/api.config";
import { API_RESPONSE } from "@/shared/config/api.utils";
import { buildPagination, buildPaginationMeta } from "@/shared/schema";
import { debugError } from "@/shared/utils/lib/logger.utils";
import { analyticsContract } from "./analytics.schema";

export const analyticsRouter = createTRPCRouter({
  providerShippingSummary: staffProcedure
    .input(analyticsContract.providerShippingSummary.input)
    .output(analyticsContract.providerShippingSummary.output)
    .query(async ({ input }) => {
      try {
        const rawQuery = (input?.query ?? {}) as {
          from?: Date;
          to?: Date;
          providerId?: string;
          methodId?: string;
          page?: number;
          limit?: number;
          sortBy?: string;
          sortOrder?: "asc" | "desc";
        };
        const query = {
          page: 1,
          limit: 50,
          sortOrder: "desc" as const,
          ...rawQuery,
        };

        const { from, to, providerId, methodId } = query;

        const pageInput = {
          page: query.page ?? 1,
          limit: query.limit ?? 50,
          sortBy: query.sortBy ?? "ordersCount",
          sortOrder: query.sortOrder ?? "desc",
        };

        const { limit, offset } = buildPagination(pageInput);

        const whereClauses = [];

        if (from && to) {
          whereClauses.push(between(order.placedAt, from, to));
        } else if (from) {
          whereClauses.push(gte(order.placedAt, from));
        } else if (to) {
          whereClauses.push(lte(order.placedAt, to));
        }

        if (providerId) {
          whereClauses.push(eq(order.shippingProviderId, providerId));
        }

        if (methodId) {
          whereClauses.push(eq(order.shippingMethodId, methodId));
        }

        const where = whereClauses.length ? and(...whereClauses) : undefined;

        const baseQuery = db
          .select({
            providerId: shippingProvider.id,
            providerName: shippingProvider.name,
            methodId: shippingMethod.id,
            methodName: shippingMethod.name,
            ordersCount: sql<number>`count(distinct ${order.id})`,
            shipmentsCount: sql<number>`count(distinct ${shipment.id})`,
            shippingRevenue: sql<number>`coalesce(sum(${order.shippingTotal}), 0)`,
          })
          .from(order)
          .leftJoin(shipment, eq(shipment.orderId, order.id))
          .leftJoin(shippingProvider, eq(order.shippingProviderId, shippingProvider.id))
          .leftJoin(shippingMethod, eq(order.shippingMethodId, shippingMethod.id))
          .where(where)
          .groupBy(shippingProvider.id, shippingProvider.name, shippingMethod.id, shippingMethod.name);

        const [{ count: totalRaw = 0 } = { count: 0 }] = await db
          .select({
            count: sql<number>`count(*)`,
          })
          .from(baseQuery.as("q"));
        const total = Number(totalRaw ?? 0);

        const rows = await db
          .select()
          .from(baseQuery.as("q"))
          .orderBy(desc(sql`ordersCount`))
          .limit(Math.min(limit, 200))
          .offset(offset);

        const metaPagination = buildPaginationMeta(total, pageInput);

        return {
          status: STATUS.SUCCESS,
          message: "Provider shipping summary fetched successfully",
          data: rows,
          meta: {
            count: total,
            pagination: metaPagination,
          },
        };
      } catch (err) {
        debugError("ANALYTICS:PROVIDER_SHIPPING_SUMMARY:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error fetching provider shipping summary", null, err as Error);
      }
    }),

  inventoryStockSummary: staffProcedure
    .input(analyticsContract.inventoryStockSummary.input)
    .output(analyticsContract.inventoryStockSummary.output)
    .query(async ({ input }) => {
      try {
        const rawQuery = (input.query ?? {}) as {
          variantIds?: string[];
          page?: number;
          limit?: number;
          sortBy?: string;
          sortOrder?: "asc" | "desc";
        };
        const query = {
          page: 1,
          limit: 50,
          sortOrder: "desc" as const,
          ...rawQuery,
        };

        const { variantIds } = rawQuery;

        const pageInput = {
          page: query.page ?? 1,
          limit: query.limit ?? 50,
          sortBy: query.sortBy ?? "totalQuantity",
          sortOrder: query.sortOrder ?? "desc",
        };

        const { limit, offset } = buildPagination(pageInput);

        const whereClauses = [];

        if (variantIds && variantIds.length > 0) {
          whereClauses.push(sql`${inventoryItem.variantId} = ANY(${variantIds})`);
        }

        const where = whereClauses.length ? and(...whereClauses) : undefined;

        const baseQuery = db
          .select({
            variantId: inventoryItem.variantId,
            totalQuantity: sql<number>`sum(${inventoryItem.quantity})`,
            totalReserved: sql<number>`sum(${inventoryItem.reserved})`,
            totalIncoming: sql<number>`sum(${inventoryItem.incoming})`,
          })
          .from(inventoryItem)
          .where(where)
          .groupBy(inventoryItem.variantId);

        const [{ count: totalRaw = 0 } = { count: 0 }] = await db
          .select({
            count: sql<number>`count(*)`,
          })
          .from(baseQuery.as("q"));
        const total = Number(totalRaw ?? 0);

        const rows = await db
          .select()
          .from(baseQuery.as("q"))
          .orderBy(desc(sql`totalQuantity`))
          .limit(Math.min(limit, 200))
          .offset(offset);

        const metaPagination = buildPaginationMeta(total, pageInput);

        return {
          status: STATUS.SUCCESS,
          message: "Inventory stock summary fetched successfully",
          data: rows,
          meta: {
            count: total,
            pagination: metaPagination,
          },
        };
      } catch (err) {
        debugError("ANALYTICS:INVENTORY_STOCK_SUMMARY:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error fetching inventory stock summary", null, err as Error);
      }
    }),

  inventoryMovementSummary: staffProcedure
    .input(analyticsContract.inventoryMovementSummary.input)
    .output(analyticsContract.inventoryMovementSummary.output)
    .query(async ({ input }) => {
      try {
        const rawQuery = (input.query ?? {}) as {
          from?: Date;
          to?: Date;
          inventoryIds?: string[];
          page?: number;
          limit?: number;
          sortBy?: string;
          sortOrder?: "asc" | "desc";
        };
        const query = {
          page: 1,
          limit: 50,
          sortOrder: "desc" as const,
          ...rawQuery,
        };

        const { from, to, inventoryIds } = rawQuery;

        const pageInput = {
          page: query.page ?? 1,
          limit: query.limit ?? 50,
          sortBy: query.sortBy ?? "totalAdjustments",
          sortOrder: query.sortOrder ?? "desc",
        };

        const { limit, offset } = buildPagination(pageInput);

        const whereClauses = [];

        if (from && to) {
          whereClauses.push(between(inventoryAdjustmentEvent.createdAt, from, to));
        } else if (from) {
          whereClauses.push(gte(inventoryAdjustmentEvent.createdAt, from));
        } else if (to) {
          whereClauses.push(lte(inventoryAdjustmentEvent.createdAt, to));
        }

        if (inventoryIds && inventoryIds.length > 0) {
          whereClauses.push(sql`${inventoryAdjustmentEvent.inventoryId} = ANY(${inventoryIds})`);
        }

        const where = whereClauses.length ? and(...whereClauses) : undefined;

        const baseQuery = db
          .select({
            inventoryId: inventoryAdjustmentEvent.inventoryId,
            totalAdjustments: sql<number>`count(*)`,
            totalIncrease: sql<number>`sum(case when ${inventoryAdjustmentEvent.quantityDelta} > 0 then ${inventoryAdjustmentEvent.quantityDelta} else 0 end)`,
            totalDecrease: sql<number>`sum(case when ${inventoryAdjustmentEvent.quantityDelta} < 0 then -${inventoryAdjustmentEvent.quantityDelta} else 0 end)`,
          })
          .from(inventoryAdjustmentEvent)
          .where(where)
          .groupBy(inventoryAdjustmentEvent.inventoryId);

        const [{ count: totalRaw = 0 } = { count: 0 }] = await db
          .select({
            count: sql<number>`count(*)`,
          })
          .from(baseQuery.as("q"));
        const total = Number(totalRaw ?? 0);

        const rows = await db
          .select()
          .from(baseQuery.as("q"))
          .orderBy(desc(sql`totalAdjustments`))
          .limit(Math.min(limit, 200))
          .offset(offset);

        const metaPagination = buildPaginationMeta(total, pageInput);

        return {
          status: STATUS.SUCCESS,
          message: "Inventory movement summary fetched successfully",
          data: rows,
          meta: {
            count: total,
            pagination: metaPagination,
          },
        };
      } catch (err) {
        debugError("ANALYTICS:INVENTORY_MOVEMENT_SUMMARY:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error fetching inventory movement summary", null, err as Error);
      }
    }),

  /** Aggregate KPIs for Studio home (database-backed). */
  studioDashboardKpis: staffProcedure
    .input(analyticsContract.studioDashboardKpis.input)
    .output(analyticsContract.studioDashboardKpis.output)
    .query(async () => {
      try {
        const [totalsRes, pendingRes, revenueRes, discountRes] = await Promise.all([
          db.select({ c: sql<number>`count(*)::int` }).from(order),
          db.select({ c: sql<number>`count(*)::int` }).from(order).where(eq(order.status, "pending")),
          db
            .select({
              s: sql<number>`coalesce(sum(${order.grandTotal}), 0)`,
            })
            .from(order)
            .where(inArray(order.status, ["paid", "shipped", "delivered"])),
          db
            .select({
              s: sql<number>`coalesce(sum(${order.discountTotal}), 0)`,
            })
            .from(order),
        ]);

        const data = {
          totalOrders: Number(totalsRes[0]?.c ?? 0),
          pendingOrders: Number(pendingRes[0]?.c ?? 0),
          paidRevenuePaise: Number(revenueRes[0]?.s ?? 0),
          discountValuePaise: Number(discountRes[0]?.s ?? 0),
        };

        return API_RESPONSE(STATUS.SUCCESS, "Studio KPIs loaded", data);
      } catch (err) {
        debugError("ANALYTICS:STUDIO_DASHBOARD_KPIS:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, "Error loading studio KPIs", null, err as Error);
      }
    }),
});
