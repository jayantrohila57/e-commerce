import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/core/api/api.methods'
import { STATUS } from '@/shared/config/api.config'
import { API_RESPONSE } from '@/shared/config/api.utils'

import { db } from '@/core/db/db'
import { inventoryItem } from '@/core/db/db.schema'
import { and, eq, ilike } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { inventoryContract } from './inventory.schema'

export const inventoryRouter = createTRPCRouter({
  // =========================
  // GET ONE BY ID OR SKU
  // =========================
  get: publicProcedure
    .input(inventoryContract.get.input)
    .output(inventoryContract.get.output)
    .query(async ({ input }) => {
      try {
        const { id, sku } = input.params

        if (!id && !sku) {
          return API_RESPONSE(STATUS.FAILED, 'Failed to fetch inventory', null)
        }

        const output = await db.query.inventoryItem.findFirst({
          where: (inv, { eq, and }) => {
            const conditions: any[] = []
            if (id) conditions.push(eq(inv.id, id))
            if (sku) conditions.push(eq(inv.sku, sku))
            return conditions.length ? and(...conditions) : undefined
          },
        })

        return API_RESPONSE(
          output ? STATUS.SUCCESS : STATUS.FAILED,
          output ? 'Inventory fetched successfully' : 'Failed to fetch inventory',
          output ?? null,
        )
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, 'Error fetching inventory', null, err as Error)
      }
    }),

  // =========================
  // GET MANY
  // =========================
  getMany: publicProcedure
    .input(inventoryContract.getMany.input)
    .output(inventoryContract.getMany.output)
    .query(async ({ input }) => {
      try {
        const { query } = input
        const limit = query?.limit ?? 20
        const offset = query?.offset ?? 0

        const conditions: any[] = []

        if (query?.search) {
          conditions.push(ilike(inventoryItem.sku, `%${query.search}%`))
        }

        const output = await db.query.inventoryItem.findMany({
          where: conditions.length ? and(...conditions) : undefined,
          limit: Math.min(limit, 100),
          offset,
          orderBy: (inv, { desc }) => [desc(inv.updatedAt)],
        })

        return API_RESPONSE(
          output?.length ? STATUS.SUCCESS : STATUS.FAILED,
          output?.length ? 'Inventories fetched successfully' : 'No inventories found',
          output,
        )
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, 'Error fetching inventories', null, err as Error)
      }
    }),

  // =========================
  // GET BY VARIANT ID
  // =========================
  getByVariantId: publicProcedure
    .input(inventoryContract.getByVariantId.input)
    .output(inventoryContract.getByVariantId.output)
    .query(async ({ input }) => {
      try {
        const { variantId } = input.params

        const output = await db.query.inventoryItem.findFirst({
          where: (inv, { eq }) => eq(inv.variantId, variantId),
        })

        return API_RESPONSE(
          output ? STATUS.SUCCESS : STATUS.FAILED,
          output ? 'Inventory fetched successfully' : 'Failed to fetch inventory',
          output ?? null,
        )
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, 'Error fetching inventory', null, err as Error)
      }
    }),

  // =========================
  // GET BY SKU
  // =========================
  getBySku: publicProcedure
    .input(inventoryContract.getBySku.input)
    .output(inventoryContract.getBySku.output)
    .query(async ({ input }) => {
      try {
        const { sku } = input.params

        const output = await db.query.inventoryItem.findFirst({
          where: (inv, { eq }) => eq(inv.sku, sku),
        })

        return API_RESPONSE(
          output ? STATUS.SUCCESS : STATUS.FAILED,
          output ? 'Inventory fetched successfully' : 'Failed to fetch inventory',
          output ?? null,
        )
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, 'Error fetching inventory', null, err as Error)
      }
    }),

  // =========================
  // CREATE
  // =========================
  create: protectedProcedure
    .input(inventoryContract.create.input)
    .output(inventoryContract.create.output)
    .mutation(async ({ input }) => {
      try {
        const { data } = input
        const id = uuidv4()

        const output = await db
          .insert(inventoryItem)
          .values({
            id,
            variantId: data.variantId,
            sku: data.sku,
            barcode: data.barcode ?? null,
            quantity: data.quantity ?? 0,
            incoming: data.incoming ?? 0,
            reserved: data.reserved ?? 0,
          })
          .returning()

        return API_RESPONSE(
          output?.length ? STATUS.SUCCESS : STATUS.FAILED,
          output?.length ? 'Inventory created successfully' : 'Failed to create inventory',
          output?.[0] ?? null,
        )
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, 'Error creating inventory', null, err as Error)
      }
    }),

  // =========================
  // UPDATE
  // =========================
  update: protectedProcedure
    .input(inventoryContract.update.input)
    .output(inventoryContract.update.output)
    .mutation(async ({ input }) => {
      try {
        const { id } = input.params
        const { data } = input

        const updateData: any = {}
        if (data.sku !== undefined) updateData.sku = data.sku
        if (data.barcode !== undefined) updateData.barcode = data.barcode
        if (data.quantity !== undefined) updateData.quantity = data.quantity
        if (data.incoming !== undefined) updateData.incoming = data.incoming
        if (data.reserved !== undefined) updateData.reserved = data.reserved

        const output = await db.update(inventoryItem).set(updateData).where(eq(inventoryItem.id, id)).returning()

        return API_RESPONSE(
          output?.length ? STATUS.SUCCESS : STATUS.FAILED,
          output?.length ? 'Inventory updated successfully' : 'Failed to update inventory',
          output?.[0] ?? null,
        )
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, 'Error updating inventory', null, err as Error)
      }
    }),

  // =========================
  // DELETE
  // =========================
  delete: protectedProcedure
    .input(inventoryContract.delete.input)
    .output(inventoryContract.delete.output)
    .mutation(async ({ input }) => {
      try {
        const { id } = input.params

        // Find first to check existence, then delete
        await db.query.inventoryItem.findFirst({
          where: (inv, { eq }) => eq(inv.id, id),
        })

        // Delete the record using delete syntax available in drizzle
        const result = await db.delete(inventoryItem).where(eq(inventoryItem.id, id)).returning()

        return API_RESPONSE(
          result?.length ? STATUS.SUCCESS : STATUS.FAILED,
          result?.length ? 'Inventory deleted successfully' : 'Failed to delete inventory',
          { deleted: result?.length > 0 },
        )
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, 'Error deleting inventory', null, err as Error)
      }
    }),

  // =========================
  // UPDATE STOCK
  // =========================
  updateStock: protectedProcedure
    .input(inventoryContract.updateStock.input)
    .output(inventoryContract.updateStock.output)
    .mutation(async ({ input }) => {
      try {
        const { id } = input.params
        const { quantity, type, incoming } = input.data

        // Get current inventory
        const currentInventory = await db.query.inventoryItem.findFirst({
          where: (inv, { eq }) => eq(inv.id, id),
        })

        if (!currentInventory) {
          return API_RESPONSE(STATUS.FAILED, 'Inventory not found', null)
        }

        let newQuantity = currentInventory.quantity

        if (type === 'add') {
          newQuantity = currentInventory.quantity + quantity
        } else if (type === 'subtract') {
          newQuantity = Math.max(0, currentInventory.quantity - quantity)
        } else if (type === 'set') {
          newQuantity = quantity
        }

        const output = await db
          .update(inventoryItem)
          .set({
            quantity: newQuantity,
            incoming: incoming ?? currentInventory.incoming,
          })
          .where(eq(inventoryItem.id, id))
          .returning()

        return API_RESPONSE(
          output?.length ? STATUS.SUCCESS : STATUS.FAILED,
          output?.length ? 'Stock updated successfully' : 'Failed to update stock',
          output?.[0] ?? null,
        )
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, 'Error updating stock', null, err as Error)
      }
    }),

  // =========================
  // SEARCH
  // =========================
  search: publicProcedure
    .input(inventoryContract.search.input)
    .output(inventoryContract.search.output)
    .query(async ({ input }) => {
      try {
        const { query } = input
        const limit = query?.limit ?? 20
        const offset = query?.offset ?? 0

        const conditions: any[] = []

        if (query?.search) {
          conditions.push(ilike(inventoryItem.sku, `%${query.search}%`))
        }

        const output = await db.query.inventoryItem.findMany({
          where: conditions.length ? and(...conditions) : undefined,
          limit: Math.min(limit, 100),
          offset,
          orderBy: (inv, { desc }) => [desc(inv.updatedAt)],
        })

        return API_RESPONSE(STATUS.SUCCESS, 'Inventories searched successfully', output)
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, 'Error searching inventories', null, err as Error)
      }
    }),
})
