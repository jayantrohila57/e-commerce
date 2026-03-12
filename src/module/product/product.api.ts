import { and, eq, ilike, isNull, not, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { createTRPCRouter, publicProcedure, staffProcedure } from "@/core/api/api.methods";
import { db } from "@/core/db/db";
import { product, productVariant } from "@/core/db/db.schema";
import { MESSAGE, STATUS } from "@/shared/config/api.config";
import { API_RESPONSE } from "@/shared/config/api.utils";
import { buildPagination, buildPaginationMeta } from "@/shared/schema";
import { debugError } from "@/shared/utils/lib/logger.utils";
import { productContract } from "./product.schema";

export const productRouter = createTRPCRouter({
  get: staffProcedure
    .input(productContract.get.input)
    .output(productContract.get.output)
    .query(async ({ input }) => {
      try {
        const { id, slug } = input.params;

        if (!id && !slug) {
          return API_RESPONSE(STATUS.FAILED, MESSAGE.PRODUCT.GET.FAILED, null);
        }

        let row: typeof product.$inferSelect | undefined;

        if (id) {
          const output = await db
            .select()
            .from(product)
            .where(and(eq(product.id, id), isNull(product.deletedAt)))
            .limit(1);
          row = output?.[0];
        } else if (slug) {
          const output = await db
            .select()
            .from(product)
            .where(and(eq(product.slug, slug), isNull(product.deletedAt)))
            .limit(1);
          row = output?.[0];
        }

        return API_RESPONSE(
          row ? STATUS.SUCCESS : STATUS.FAILED,
          row ? MESSAGE.PRODUCT.GET.SUCCESS : MESSAGE.PRODUCT.GET.FAILED,
          row ?? null,
        );
      } catch (err) {
        debugError("PRODUCT:GET:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT.GET.ERROR, null, err as Error);
      }
    }),
  getBySlug: publicProcedure
    .input(productContract.getBySlug.input)
    .output(productContract.getBySlug.output)
    .query(async ({ input }) => {
      try {
        const { slug } = input.params;

        const output = await db
          .select()
          .from(product)
          .where(and(eq(product.slug, slug), eq(product.isActive, true), isNull(product.deletedAt)))
          .limit(1);

        const row = output?.[0] ?? null;

        return API_RESPONSE(
          row ? STATUS.SUCCESS : STATUS.FAILED,
          row ? MESSAGE.PRODUCT.GET_BY_SLUG.SUCCESS : MESSAGE.PRODUCT.GET_BY_SLUG.FAILED,
          row ? { product: row } : null,
        );
      } catch (err) {
        debugError("PRODUCT:GET_BY_SLUG:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT.GET_BY_SLUG.ERROR, null, err as Error);
      }
    }),
  getBySubcategorySlug: publicProcedure
    .input(productContract.getBySubcategorySlug.input)
    .output(productContract.getBySubcategorySlug.output)
    .query(async ({ input }) => {
      try {
        const { subcategorySlug, categorySlug } = input.params;

        const products = await db.query.product.findMany({
          where: (p, { eq, and, isNull }) =>
            and(
              eq(p.subcategorySlug, subcategorySlug),
              eq(p.categorySlug, categorySlug),
              eq(p.isActive, true),
              eq(p.status, "live"),
              isNull(p.deletedAt),
            ),
          with: {
            variants: {
              where: (pv, { isNull }) => isNull(pv.deletedAt),
            },
          },
          orderBy: (p, { desc }) => [desc(p.createdAt)],
        });

        return API_RESPONSE(
          products.length ? STATUS.SUCCESS : STATUS.FAILED,
          products.length ? MESSAGE.PRODUCT.GET_MANY.SUCCESS : MESSAGE.PRODUCT.GET_MANY.FAILED,
          products,
        );
      } catch (err) {
        debugError("PRODUCT:GET_BY_SUBCATEGORY_SLUG:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT.GET_MANY.ERROR, null, err as Error);
      }
    }),
  getMany: staffProcedure
    .input(productContract.getMany.input)
    .output(productContract.getMany.output)
    .query(async ({ input }) => {
      try {
        const { query } = input;
        const {
          limit,
          offset,
          categorySlug,
          subcategorySlug,
          isActive,
          deleted,
          search,
          status,
        } = query;

        const conditions = [];
        if (deleted === true) {
          conditions.push(not(isNull(product.deletedAt)));
        } else {
          conditions.push(isNull(product.deletedAt));
        }
        if (categorySlug) conditions.push(eq(product.categorySlug, categorySlug));
        if (subcategorySlug) conditions.push(eq(product.subcategorySlug, subcategorySlug));
        if (isActive !== undefined) conditions.push(eq(product.isActive, isActive));
        if (status) conditions.push(eq(product.status, status));
        if (search) conditions.push(ilike(product.title, `%${search}%`));

        const where = conditions.length ? and(...conditions) : undefined;

        const pageInput = {
          page: offset && limit ? Math.floor(offset / limit) + 1 : 1,
          limit: limit ?? 20,
          sortBy: undefined as string | undefined,
          sortOrder: "desc" as const,
        };

        const paging = buildPagination(pageInput);
        const effectiveOffset = offset ?? paging.offset;
        const effectiveLimit = paging.limit;

        const [{ count: totalRaw = 0 } = { count: 0 }] = await db
          .select({ count: sql<number>`count(*)` })
          .from(product)
          .where(where);
        const total = Number(totalRaw ?? 0);

        const products = await db.query.product.findMany({
          limit: effectiveLimit,
          offset: effectiveOffset,
          where,
          orderBy: (p, { desc }) => [desc(p.createdAt)],
        });

        const metaPagination = buildPaginationMeta(total, pageInput);

        return {
          status: STATUS.SUCCESS,
          message: MESSAGE.PRODUCT.GET_MANY.SUCCESS,
          data: products,
          meta: {
            count: total,
            pagination: metaPagination,
          },
        };
      } catch (err) {
        debugError("PRODUCT:GET_MANY:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT.GET_MANY.ERROR, null, err as Error);
      }
    }),
  getPDPProductByVariant: publicProcedure
    .input(productContract.getPDPProduct.input)
    .output(productContract.getPDPProduct.output)
    .query(async ({ input }) => {
      try {
        const { slug } = input.params;

        // Step 1: locate the variant by its slug
        const variant = await db.query.productVariant.findFirst({
          where: (pv, { eq, and, isNull }) => and(eq(pv.slug, slug), isNull(pv.deletedAt)),
        });

        if (!variant) {
          return API_RESPONSE(STATUS.FAILED, MESSAGE.PRODUCT.GET_PDP_PRODUCT.NOT_FOUND, null);
        }

        // Step 2: fetch the product AND all its variants
        const product = await db.query.product.findFirst({
          where: (p, { eq, and, isNull }) => and(eq(p.id, variant.productId), isNull(p.deletedAt)),
          with: {
            variants: {
              where: (pv, { eq, isNull }) => isNull(pv.deletedAt), // fetch ALL alive variants
            },
          },
        });

        if (!product) {
          return API_RESPONSE(STATUS.FAILED, MESSAGE.PRODUCT.GET_PDP_PRODUCT.FAILED, null);
        }

        return API_RESPONSE(STATUS.SUCCESS, MESSAGE.PRODUCT.GET_PDP_PRODUCT.SUCCESS, {
          product: {
            ...product,
            variants: product.variants, // full squad
          },
        });
      } catch (err) {
        debugError("PRODUCT:GET_PDP_PRODUCT:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT.GET_PDP_PRODUCT.ERROR, null, err as Error);
      }
    }),
  getPDPProductByVariantFullPath: publicProcedure
    .input(productContract.getPDPProductByVariantFullPath.input)
    .output(productContract.getPDPProductByVariantFullPath.output)
    .query(async ({ input }) => {
      try {
        const { categorySlug, subcategorySlug, variantSlug } = input.params;

        // Step 1: Try to locate variant by slug
        const variant = await db.query.productVariant.findFirst({
          where: (pv, { eq, and, isNull }) => and(eq(pv.slug, variantSlug), isNull(pv.deletedAt)),
        });

        if (variant) {
          const productData = await db.query.product.findFirst({
            where: (p, { eq, and, isNull }) =>
              and(
                eq(p.id, variant.productId),
                eq(p.categorySlug, categorySlug),
                eq(p.subcategorySlug, subcategorySlug),
                eq(p.isActive, true),
                eq(p.status, "live"),
                isNull(p.deletedAt),
              ),
            with: { variants: { where: (pv, { isNull }) => isNull(pv.deletedAt) } },
          });
          if (!productData) {
            return API_RESPONSE(STATUS.FAILED, MESSAGE.PRODUCT.GET_PDP_PRODUCT.NOT_FOUND, null);
          }
          // Ensure variant matching URL is first so PDP displays correct one
          const variants = [...productData.variants];
          const matchIdx = variants.findIndex((v) => v.slug === variantSlug);
          if (matchIdx > 0) {
            const [matched] = variants.splice(matchIdx, 1);
            variants.unshift(matched);
          }
          return API_RESPONSE(STATUS.SUCCESS, MESSAGE.PRODUCT.GET_PDP_PRODUCT.SUCCESS, {
            product: { ...productData, variants },
          });
        }

        // Fallback: variantSlug may be product slug (product without variants)
        const found = await db.query.product.findFirst({
          where: (p, { eq, and, isNull }) =>
            and(
              eq(p.slug, variantSlug),
              eq(p.categorySlug, categorySlug),
              eq(p.subcategorySlug, subcategorySlug),
              eq(p.isActive, true),
              eq(p.status, "live"),
              isNull(p.deletedAt),
            ),
          with: { variants: { where: (pv, { isNull }) => isNull(pv.deletedAt) } },
        });

        if (!found) {
          return API_RESPONSE(STATUS.FAILED, MESSAGE.PRODUCT.GET_PDP_PRODUCT.NOT_FOUND, null);
        }

        if (found.variants.length === 0) {
          const productWithVirtualVariant = {
            ...found,
            variants: [
              {
                id: found.id,
                slug: found.slug,
                title: found.title,
                productId: found.id,
                priceModifierType: "flat_decrease" as const,
                priceModifierValue: "0",
                attributes: null as { title: string; type: string; value: string }[] | null,
                media: null as { url: string }[] | null,
                createdAt: found.createdAt,
                updatedAt: found.updatedAt,
                deletedAt: null as Date | null,
              },
            ],
          };
          return API_RESPONSE(STATUS.SUCCESS, MESSAGE.PRODUCT.GET_PDP_PRODUCT.SUCCESS, {
            product: productWithVirtualVariant,
          });
        }

        return API_RESPONSE(STATUS.SUCCESS, MESSAGE.PRODUCT.GET_PDP_PRODUCT.SUCCESS, {
          product: found,
        });
      } catch (err) {
        debugError("PRODUCT:GET_PDP_PRODUCT_FULL_PATH:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT.GET_PDP_PRODUCT.ERROR, null, err as Error);
      }
    }),
  getProductWithProductVariants: publicProcedure
    .input(productContract.getProductWithProductVariants.input)
    .output(productContract.getProductWithProductVariants.output)
    .query(async ({ input }) => {
      try {
        const output = await db.query.product.findFirst({
          where: (c, { eq }) => eq(c.slug, input.params.slug),
          with: {
            variants: {
              orderBy: (s, { asc }) => [asc(s.createdAt)],
            },
          },
        });

        const row = output ?? null;

        return API_RESPONSE(
          row ? STATUS.SUCCESS : STATUS.FAILED,
          row ? MESSAGE.PRODUCT.GET_BY_SLUG.SUCCESS : MESSAGE.PRODUCT.GET_BY_SLUG.FAILED,
          row ? { product: row } : null,
        );
      } catch (err) {
        debugError("PRODUCT:GET_BY_SLUG:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT.GET_BY_SLUG.ERROR, null, err as Error);
      }
    }),

  create: staffProcedure
    .input(productContract.create.input)
    .output(productContract.create.output)
    .mutation(async ({ input }) => {
      try {
        const now = new Date();
        const body = input.body;

        const slug = body.slug ?? body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();

        const [output] = await db
          .insert(product)
          .values({
            id: uuidv4(),
            title: body.title,
            description: body.description ?? null,
            metaTitle: body.metaTitle ?? null,
            metaDescription: body.metaDescription ?? null,
            slug,

            // new required fields
            categorySlug: body.categorySlug,
            subcategorySlug: body.subcategorySlug,

            basePrice: body.basePrice,
            baseCurrency: body.baseCurrency ?? "INR",

            features: body.features ?? null,

            status: body.status ?? "draft",
            isActive: body.isActive ?? true,

            deletedAt: null,
            createdAt: now,
            updatedAt: now,
          })
          .returning();

        return API_RESPONSE(
          output ? STATUS.SUCCESS : STATUS.FAILED,
          output ? MESSAGE.PRODUCT.CREATE.SUCCESS : MESSAGE.PRODUCT.CREATE.FAILED,
          output,
        );
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT.CREATE.ERROR, null, err as Error);
      }
    }),
  update: staffProcedure
    .input(productContract.update.input)
    .output(productContract.update.output)
    .mutation(async ({ input }) => {
      try {
        const { params, body } = input;

        const [existingProduct] = await db
          .select()
          .from(product)
          .where(and(eq(product.id, params.id), isNull(product.deletedAt)))
          .limit(1);

        if (!existingProduct) {
          return API_RESPONSE(STATUS.FAILED, MESSAGE.PRODUCT.UPDATE.FAILED, null);
        }

        if (body.slug && body.slug !== existingProduct.slug) {
          const [existingSlug] = await db
            .select()
            .from(product)
            .where(and(eq(product.slug, body.slug), isNull(product.deletedAt)))
            .limit(1);

          if (existingSlug) {
            return API_RESPONSE(STATUS.FAILED, "Slug already exists", null);
          }
        }

        // Build update object dynamically
        const updateData: Record<string, unknown> = { updatedAt: new Date() };

        for (const key in body) {
          const value = body[key as keyof typeof body];
          if (value !== undefined) updateData[key] = value;
        }

        const [updatedProduct] = await db.update(product).set(updateData).where(eq(product.id, params.id)).returning();

        return API_RESPONSE(
          updatedProduct ? STATUS.SUCCESS : STATUS.FAILED,
          updatedProduct ? MESSAGE.PRODUCT.UPDATE.SUCCESS : MESSAGE.PRODUCT.UPDATE.FAILED,
          updatedProduct,
        );
      } catch (err) {
        debugError("PRODUCT:UPDATE:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT.UPDATE.ERROR, null, err as Error);
      }
    }),
  delete: staffProcedure
    .input(productContract.delete.input)
    .output(productContract.delete.output)
    .mutation(async ({ input }) => {
      try {
        const [existing] = await db
          .select()
          .from(product)
          .where(and(eq(product.id, input.params.id), isNull(product.deletedAt)))
          .limit(1);

        if (!existing) {
          return API_RESPONSE(STATUS.FAILED, MESSAGE.PRODUCT.DELETE.FAILED, null);
        }

        const now = new Date();

        const [output] = await db
          .update(product)
          .set({
            deletedAt: now,
            updatedAt: now,
            slug: `${existing.slug}-deleted-${Date.now()}`,
            isActive: false,
          })
          .where(eq(product.id, input.params.id))
          .returning({ id: product.id });

        return API_RESPONSE(
          output ? STATUS.SUCCESS : STATUS.FAILED,
          output ? MESSAGE.PRODUCT.DELETE.SUCCESS : MESSAGE.PRODUCT.DELETE.FAILED,
          output,
        );
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT.DELETE.ERROR, null, err as Error);
      }
    }),
  search: publicProcedure
    .input(productContract.search.input)
    .output(productContract.search.output)
    .query(async ({ input }) => {
      try {
        const output = await db.query.product.findMany({
          where: and(ilike(product.title, `%${input.query.q}%`), isNull(product.deletedAt)),
          limit: input.query.limit ?? 10,
          orderBy: (p, { asc }) => [asc(p.createdAt)],
        });

        return API_RESPONSE(
          output.length ? STATUS.SUCCESS : STATUS.FAILED,
          output.length ? MESSAGE.PRODUCT.SEARCH.SUCCESS : MESSAGE.PRODUCT.SEARCH.FAILED,
          output,
        );
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT.SEARCH.ERROR, [], err as Error);
      }
    }),
});
