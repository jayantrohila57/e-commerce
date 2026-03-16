import { and, eq, ilike, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { createTRPCRouter, staffProcedure } from "@/core/api/api.methods";
import { db } from "@/core/db/db";
import { warehouse } from "@/core/db/db.schema";
import { buildPagination, buildPaginationMeta, detailedResponse } from "@/shared/schema";
import { warehouseContract } from "./warehouse.schema";

export const warehouseRouter = createTRPCRouter({
  list: staffProcedure
    .input(warehouseContract.list.input)
    .output(warehouseContract.list.output)
    .query(async ({ input }) => {
      const query = input?.query;
      const limit = query?.limit ?? 20;
      const offset = query?.offset ?? 0;

      const pageInput = {
        page: Math.floor(offset / limit) + 1,
        limit,
        sortBy: undefined as string | undefined,
        sortOrder: "asc" as const,
      };

      const paging = buildPagination(pageInput);
      const effectiveOffset = paging.offset;
      const effectiveLimit = paging.limit;

      const rows = await db.query.warehouse.findMany({
        where: (w, { and: andLocal, ilike: ilikeLocal, eq: eqLocal }) =>
          andLocal(
            query?.search
              ? (ilikeLocal(w.name, `%${query.search}%`) ?? ilikeLocal(w.code, `%${query.search}%`))
              : undefined,
            query?.isActive !== undefined ? eqLocal(w.isActive, query.isActive) : undefined,
          ),
        orderBy: (w, { asc }) => [asc(w.name)],
        limit: Math.min(effectiveLimit, 100),
        offset: effectiveOffset,
      });

      const [{ count: totalRaw = 0 } = { count: 0 }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(warehouse)
        .where(
          query?.search || query?.isActive !== undefined
            ? and(
                query?.search ? ilike(warehouse.name, `%${query.search}%`) : undefined,
                query?.isActive !== undefined ? eq(warehouse.isActive, query.isActive) : undefined,
              )
            : undefined,
        );

      const total = Number(totalRaw ?? 0);
      const metaPagination = buildPaginationMeta(total, pageInput);

      return {
        status: "success",
        message: rows.length ? "Warehouses fetched" : "No warehouses found",
        data: rows,
        meta: {
          count: total,
          pagination: metaPagination,
        },
      };
    }),

  listActive: staffProcedure
    .input(warehouseContract.listActive.input)
    .output(warehouseContract.listActive.output)
    .query(async ({ input }) => {
      const search = input?.query?.search;

      const rows = await db.query.warehouse.findMany({
        where: (w, { and: andLocal, ilike: ilikeLocal, eq: eqLocal }) =>
          andLocal(
            eqLocal(w.isActive, true),
            search ? (ilikeLocal(w.name, `%${search}%`) ?? ilikeLocal(w.code, `%${search}%`)) : undefined,
          ),
        orderBy: (w, { asc }) => [asc(w.name)],
        limit: 100,
      });

      return {
        status: "success",
        message: rows.length ? "Active warehouses fetched" : "No active warehouses found",
        data: rows,
      };
    }),

  get: staffProcedure
    .input(warehouseContract.get.input)
    .output(warehouseContract.get.output)
    .query(async ({ input }) => {
      const { id } = input.params;

      const row = await db.query.warehouse.findFirst({
        where: (w, { eq: eqLocal }) => eqLocal(w.id, id),
      });

      return {
        status: row ? "success" : "failed",
        message: row ? "Warehouse fetched" : "Warehouse not found",
        data: row ?? null,
      };
    }),

  create: staffProcedure
    .input(warehouseContract.create.input)
    .output(warehouseContract.create.output)
    .mutation(async ({ input }) => {
      const { body } = input;

      const [created] = await db
        .insert(warehouse)
        .values({
          id: uuidv4(),
          code: body.code,
          name: body.name,
          country: body.country,
          state: body.state ?? null,
          city: body.city ?? null,
          addressLine1: body.addressLine1 ?? null,
          addressLine2: body.addressLine2 ?? null,
          postalCode: body.postalCode ?? null,
          isActive: body.isActive ?? true,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return {
        status: "success",
        message: "Warehouse created",
        data: created,
      };
    }),

  update: staffProcedure
    .input(warehouseContract.update.input)
    .output(warehouseContract.update.output)
    .mutation(async ({ input }) => {
      const { params, body } = input;

      const [updated] = await db
        .update(warehouse)
        .set({
          code: body.code,
          name: body.name,
          country: body.country,
          state: body.state ?? null,
          city: body.city ?? null,
          addressLine1: body.addressLine1 ?? null,
          addressLine2: body.addressLine2 ?? null,
          postalCode: body.postalCode ?? null,
          isActive: body.isActive,
          updatedAt: new Date(),
        })
        .where(eq(warehouse.id, params.id))
        .returning();

      return {
        status: updated ? "success" : "failed",
        message: updated ? "Warehouse updated" : "Warehouse not found",
        data: updated ?? null,
      };
    }),
});
