// src/module/product-variant/product-variant.api.ts
import { createTRPCRouter, protectedProcedure } from "@/core/api/api.methods";
import { MESSAGE, STATUS } from "@/shared/config/api.config";
import { API_RESPONSE } from "@/shared/config/api.utils";

import { db } from "@/core/db/db";
import { inventoryItem, productVariant } from "@/core/db/db.schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { productVariantContract } from "./product-variant.schema";

export const productVariantRouter = createTRPCRouter({
  // =========================
  // CREATE (with inventory in atomic transaction)
  // =========================
  create: protectedProcedure
    .input(productVariantContract.create.input)
    .output(productVariantContract.create.output)
    .mutation(async ({ input }) => {
      try {
        const { body } = input;
        const variantId = uuidv4();
        const inventoryId = uuidv4();

        const cleanMedia = body.media?.filter(Boolean) ?? [];
        const cleanAttributes = body.attributes ?? [];

        // Atomic transaction: insert variant and inventory together
        const result = await db.transaction(async (tx) => {
          // 1. Insert variant
          const [createdVariant] = await tx
            .insert(productVariant)
            .values({
              id: variantId,
              slug: body.slug,
              productId: body.productId,
              title: body.title,
              priceModifierType: body.priceModifierType,
              priceModifierValue: body.priceModifierValue,
              media: cleanMedia,
              attributes: cleanAttributes,
              createdAt: new Date(),
              updatedAt: new Date(),
            })
            .returning();

          // 2. Insert inventory using the variant ID
          const [createdInventory] = await tx
            .insert(inventoryItem)
            .values({
              id: inventoryId,
              variantId,
              sku: body.inventory.sku,
              barcode: body.inventory.barcode,
              quantity: body.inventory.quantity,
              incoming: body.inventory.incoming,
              reserved: body.inventory.reserved,
              updatedAt: new Date(),
            })
            .returning();

          return {
            variant: createdVariant,
            inventory: createdInventory,
          };
        });

        // Return variant with inventory nested
        return API_RESPONSE(STATUS.SUCCESS, MESSAGE.PRODUCT_VARIANT.CREATE.SUCCESS, {
          ...result.variant,
          inventory: result.inventory,
        });
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT_VARIANT.CREATE.ERROR, null, err as Error);
      }
    }),

  // =========================
  // GET (single by ID with inventory)
  // =========================
  get: protectedProcedure
    .input(productVariantContract.get.input)
    .output(productVariantContract.get.output)
    .query(async ({ input }) => {
      try {
        const { params } = input;

        const result = await db.query.productVariant.findFirst({
          where: eq(productVariant.id, params.id),
          with: {
            inventory: true,
          },
        });

        return API_RESPONSE(
          result ? STATUS.SUCCESS : STATUS.FAILED,
          result ? MESSAGE.PRODUCT_VARIANT.GET.SUCCESS : MESSAGE.PRODUCT_VARIANT.GET.FAILED,
          result ?? null,
        );
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT_VARIANT.GET.ERROR, null, err as Error);
      }
    }),

  // =========================
  // GET MANY (with pagination and optional productId filter)
  // =========================
  getMany: protectedProcedure
    .input(productVariantContract.getMany.input)
    .output(productVariantContract.getMany.output)
    .query(async ({ input }) => {
      try {
        const { query } = input;
        const { limit, offset, productId } = query;

        let queryBuilder = db.query.productVariant.findMany({
          limit,
          offset,
          with: {
            inventory: true,
          },
        });

        if (productId) {
          queryBuilder = db.query.productVariant.findMany({
            where: eq(productVariant.productId, productId),
            limit,
            offset,
            with: {
              inventory: true,
            },
          });
        }

        const results = await queryBuilder;

        return API_RESPONSE(STATUS.SUCCESS, MESSAGE.PRODUCT_VARIANT.GET_MANY.SUCCESS, results);
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT_VARIANT.GET_MANY.ERROR, null, err as Error);
      }
    }),

  // =========================
  // GET BY SLUG
  // =========================
  getBySlug: protectedProcedure
    .input(productVariantContract.getBySlug.input)
    .output(productVariantContract.getBySlug.output)
    .query(async ({ input }) => {
      try {
        const { params } = input;

        const result = await db.query.productVariant.findFirst({
          where: eq(productVariant.slug, params.slug),
          with: {
            inventory: true,
          },
        });

        return API_RESPONSE(
          result ? STATUS.SUCCESS : STATUS.FAILED,
          result ? MESSAGE.PRODUCT_VARIANT.GET_BY_SLUG.SUCCESS : MESSAGE.PRODUCT_VARIANT.GET_BY_SLUG.FAILED,
          result ?? null,
        );
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT_VARIANT.GET_BY_SLUG.ERROR, null, err as Error);
      }
    }),

  // =========================
  // UPDATE
  // =========================
  update: protectedProcedure
    .input(productVariantContract.update.input)
    .output(productVariantContract.update.output)
    .mutation(async ({ input }) => {
      try {
        const { id } = input.params;
        const { body } = input;

        const cleanMedia = body.media?.filter(Boolean) ?? undefined;

        const cleanAttributes = body.attributes ?? undefined;

        const [output] = await db
          .update(productVariant)
          .set({
            ...body,
            media: cleanMedia,
            attributes: cleanAttributes,
            updatedAt: new Date(),
          })
          .where(eq(productVariant.id, id))
          .returning();

        return API_RESPONSE(
          output ? STATUS.SUCCESS : STATUS.FAILED,
          output ? MESSAGE.PRODUCT_VARIANT.UPDATE.SUCCESS : MESSAGE.PRODUCT_VARIANT.UPDATE.FAILED,
          output ?? null,
        );
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT_VARIANT.UPDATE.ERROR, null, err as Error);
      }
    }),

  // =========================
  // DELETE
  // =========================
  delete: protectedProcedure
    .input(productVariantContract.delete.input)
    .output(productVariantContract.delete.output)
    .mutation(async ({ input }) => {
      try {
        const { id } = input.params;

        const [output] = await db
          .update(productVariant)
          .set({
            deletedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(productVariant.id, id))
          .returning({ id: productVariant.id });

        return API_RESPONSE(
          output ? STATUS.SUCCESS : STATUS.FAILED,
          output ? MESSAGE.PRODUCT_VARIANT.DELETE.SUCCESS : MESSAGE.PRODUCT_VARIANT.DELETE.FAILED,
          output ?? null,
        );
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT_VARIANT.DELETE.ERROR, null, err as Error);
      }
    }),
});

export type ProductVariantRouter = typeof productVariantRouter;
