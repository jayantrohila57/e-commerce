import { and, eq, ilike, isNull, not } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { createTRPCRouter, publicProcedure, staffProcedure } from "@/core/api/api.methods";
import { db } from "@/core/db/db";
import { subcategory } from "@/core/db/db.schema";
import { MESSAGE, STATUS } from "@/shared/config/api.config";
import { API_RESPONSE } from "@/shared/config/api.utils";
import { subcategoryContract } from "./subcategory.schema";

const computePrice = (basePrice: number, priceModifierValue: string, priceModifierType: string): number => {
  const base = basePrice;
  const val = Number(priceModifierValue);

  switch (priceModifierType) {
    case "flat_increase":
      return base + val;
    case "flat_decrease":
      return base - val;
    case "percent_increase":
      return base + Math.round((base * val) / 100);
    case "percent_decrease":
      return base - Math.round((base * val) / 100);
    default:
      return base;
  }
};

export const subcategoryRouter = createTRPCRouter({
  getMany: publicProcedure
    .input(subcategoryContract.getMany.input)
    .output(subcategoryContract.getMany.output)
    .query(async ({ input }) => {
      try {
        const conditions = [];
        if (input.query?.search) conditions.push(ilike(subcategory.title, `%${input.query.search}%`));
        if (input.query?.visibility) conditions.push(eq(subcategory.visibility, input.query.visibility));
        if (input.query?.isFeatured !== undefined) conditions.push(eq(subcategory.isFeatured, input.query.isFeatured));
        if (input.query?.categorySlug) conditions.push(eq(subcategory.categorySlug, input.query.categorySlug));
        // Exclude soft-deleted subcategories by default
        if (input.query?.deleted !== true) {
          conditions.push(isNull(subcategory.deletedAt));
        }

        const output = await db.query.subcategory.findMany({
          where: conditions.length ? and(...conditions) : undefined,
          limit: input.query?.limit ?? 50,
          offset: input.query?.offset ?? 0,
          orderBy: (s, { asc }) => [asc(s.displayOrder)],
        });

        return API_RESPONSE(
          output?.length ? STATUS.SUCCESS : STATUS.FAILED,
          output?.length ? MESSAGE.SUBCATEGORY.GET_MANY.SUCCESS : MESSAGE.SUBCATEGORY.GET_MANY.FAILED,
          output ?? [],
        );
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.SUBCATEGORY.GET_MANY.ERROR, [], err as Error);
      }
    }),

  getBySlug: publicProcedure
    .input(subcategoryContract.getBySlug.input)
    .output(subcategoryContract.getBySlug.output)
    .query(async ({ input }) => {
      try {
        const { slug, categorySlug } = input.params;
        if (!slug || !categorySlug) return API_RESPONSE(STATUS.FAILED, MESSAGE.SUBCATEGORY.GET_BY_SLUG.FAILED, null);

        const subcategoryData = await db.query.subcategory.findFirst({
          where: (s, { eq, and }) => and(eq(s.slug, slug), eq(s.categorySlug, categorySlug)),
        });

        if (!subcategoryData) return API_RESPONSE(STATUS.FAILED, MESSAGE.SUBCATEGORY.GET_BY_SLUG.FAILED, null);

        // Fetch products with their variants for this subcategory
        const productsRaw = await db.query.product.findMany({
          where: (p, { eq, and, isNull }) =>
            and(
              eq(p.subcategorySlug, slug),
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

        // Flatten all variants with their product data; include products without variants as "virtual" entries
        const flattenedVariants = [];
        for (const product of productsRaw) {
          if (product.variants.length > 0) {
            for (const variant of product.variants) {
              flattenedVariants.push({
                id: variant.id,
                slug: variant.slug,
                title: variant.title,
                priceModifierType: variant.priceModifierType,
                priceModifierValue: variant.priceModifierValue,
                attributes: variant.attributes,
                media: variant.media,
                productId: product.id,
                productTitle: product.title,
                productSlug: product.slug,
                productDescription: product.description,
                productBasePrice: product.basePrice,
                productBaseImage: product.baseImage,
                finalPrice: computePrice(product.basePrice, variant.priceModifierValue, variant.priceModifierType),
              });
            }
          } else {
            // Product without variants: add as virtual entry using product slug
            flattenedVariants.push({
              id: product.id,
              slug: product.slug,
              title: product.title,
              priceModifierType: "flat_decrease",
              priceModifierValue: "0",
              attributes: null,
              media: null,
              productId: product.id,
              productTitle: product.title,
              productSlug: product.slug,
              productDescription: product.description,
              productBasePrice: product.basePrice,
              productBaseImage: product.baseImage,
              finalPrice: product.basePrice,
            });
          }
        }

        return API_RESPONSE(STATUS.SUCCESS, MESSAGE.SUBCATEGORY.GET_BY_SLUG.SUCCESS, {
          subcategoryData,
          variants: flattenedVariants,
        });
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.SUBCATEGORY.GET_BY_SLUG.ERROR, null, err as Error);
      }
    }),

  create: staffProcedure
    .input(subcategoryContract.create.input)
    .output(subcategoryContract.create.output)
    .mutation(async ({ input }) => {
      try {
        const [output] = await db
          .insert(subcategory)
          .values({
            id: uuidv4(),
            categorySlug: input.body.categorySlug,
            slug: input.body.slug ?? input.body.title.toLowerCase().replace(/\s+/g, "-"),
            title: input.body.title,
            description: input.body.description ?? null,
            icon: input.body.icon ?? null,
            color: input.body.color ?? null,
            displayType: input.body.displayType ?? "grid",
            visibility: input.body.visibility ?? "public",
            displayOrder: input.body.displayOrder ?? 0,
            image: input.body.image ?? null,
            isFeatured: input.body.isFeatured ?? false,
            metaTitle: input.body.metaTitle ?? null,
            metaDescription: input.body.metaDescription ?? null,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();

        return API_RESPONSE(
          output ? STATUS.SUCCESS : STATUS.FAILED,
          output ? MESSAGE.SUBCATEGORY.CREATE.SUCCESS : MESSAGE.SUBCATEGORY.CREATE.FAILED,
          output,
        );
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.SUBCATEGORY.CREATE.ERROR, null, err as Error);
      }
    }),

  update: staffProcedure
    .input(subcategoryContract.update.input)
    .output(subcategoryContract.update.output)
    .mutation(async ({ input }) => {
      try {
        const [output] = await db
          .update(subcategory)
          .set({
            title: input.body.title ?? undefined,
            slug: input.body.slug ?? undefined,
            description: input.body.description ?? undefined,
            icon: input.body.icon ?? undefined,
            color: input.body.color ?? undefined,
            displayType: input.body.displayType ?? undefined,
            visibility: input.body.visibility ?? undefined,
            displayOrder: input.body.displayOrder ?? undefined,
            image: input.body.image ?? undefined,
            isFeatured: input.body.isFeatured ?? undefined,
            metaTitle: input.body.metaTitle ?? undefined,
            metaDescription: input.body.metaDescription ?? undefined,
            updatedAt: new Date(),
          })
          .where(eq(subcategory.id, String(input.params.id)))
          .returning();

        return API_RESPONSE(
          output ? STATUS.SUCCESS : STATUS.FAILED,
          output ? MESSAGE.SUBCATEGORY.UPDATE.SUCCESS : MESSAGE.SUBCATEGORY.UPDATE.FAILED,
          output,
        );
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.SUBCATEGORY.UPDATE.ERROR, null, err as Error);
      }
    }),

  delete: staffProcedure
    .input(subcategoryContract.delete.input)
    .output(subcategoryContract.delete.output)
    .mutation(async ({ input }) => {
      try {
        const [output] = await db
          .update(subcategory)
          .set({ deletedAt: new Date() })
          .where(eq(subcategory.id, String(input.params.id)))
          .returning({ id: subcategory.id });

        return API_RESPONSE(
          output ? STATUS.SUCCESS : STATUS.FAILED,
          output ? MESSAGE.SUBCATEGORY.DELETE.SUCCESS : MESSAGE.SUBCATEGORY.DELETE.FAILED,
          output,
        );
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.SUBCATEGORY.DELETE.ERROR, null, err as Error);
      }
    }),

  getAvailable: publicProcedure
    .input(subcategoryContract.getAvailable.input)
    .output(subcategoryContract.getAvailable.output)
    .query(async ({ input }) => {
      try {
        const conditions = [
          not(eq(subcategory.categorySlug, input.query.excludeCategorySlug)),
          isNull(subcategory.deletedAt),
        ];

        if (input.query?.search) {
          conditions.push(ilike(subcategory.title, `%${input.query.search}%`));
        }

        const output = await db.query.subcategory.findMany({
          where: and(...conditions),
          orderBy: (s, { asc }) => [asc(s.displayOrder), asc(s.title)],
        });

        return API_RESPONSE(
          output?.length ? STATUS.SUCCESS : STATUS.FAILED,
          output?.length ? MESSAGE.SUBCATEGORY.GET_MANY.SUCCESS : MESSAGE.SUBCATEGORY.GET_MANY.FAILED,
          output ?? [],
        );
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.SUBCATEGORY.GET_MANY.ERROR, null, err as Error);
      }
    }),

  transfer: staffProcedure
    .input(subcategoryContract.transfer.input)
    .output(subcategoryContract.transfer.output)
    .mutation(async ({ input }) => {
      try {
        const [output] = await db
          .update(subcategory)
          .set({
            categorySlug: input.body.categorySlug,
            updatedAt: new Date(),
          })
          .where(eq(subcategory.id, String(input.params.id)))
          .returning();

        return API_RESPONSE(
          output ? STATUS.SUCCESS : STATUS.FAILED,
          output ? MESSAGE.SUBCATEGORY.UPDATE.SUCCESS : MESSAGE.SUBCATEGORY.UPDATE.FAILED,
          output,
        );
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.SUBCATEGORY.UPDATE.ERROR, null, err as Error);
      }
    }),
});
