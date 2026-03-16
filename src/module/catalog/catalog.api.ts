import { and, isNull, sql } from "drizzle-orm";
import { createTRPCRouter, staffProcedure } from "@/core/api/api.methods";
import { db } from "@/core/db/db";
import { attribute, category, product, productVariant, subcategory } from "@/core/db/db.schema";
import { MESSAGE, STATUS } from "@/shared/config/api.config";
import { API_RESPONSE } from "@/shared/config/api.utils";
import { catalogContract, catalogOverviewSchema } from "./catalog.schema";

export const catalogRouter = createTRPCRouter({
  overview: staffProcedure
    .input(catalogContract.overview.input)
    .output(catalogContract.overview.output)
    .query(async () => {
      try {
        const [
          [{ count: totalProductsRaw = 0 } = { count: 0 }],
          [{ count: totalProductVariantsRaw = 0 } = { count: 0 }],
          [{ count: totalCategoriesRaw = 0 } = { count: 0 }],
          [{ count: totalSubcategoriesRaw = 0 } = { count: 0 }],
          [{ count: totalAttributesRaw = 0 } = { count: 0 }],
        ] = await Promise.all([
          db.select({ count: sql<number>`count(*)` }).from(product).where(isNull(product.deletedAt)),
          db.select({ count: sql<number>`count(*)` }).from(productVariant).where(isNull(productVariant.deletedAt)),
          db.select({ count: sql<number>`count(*)` }).from(category).where(isNull(category.deletedAt)),
          db.select({ count: sql<number>`count(*)` }).from(subcategory).where(isNull(subcategory.deletedAt)),
          db.select({ count: sql<number>`count(*)` }).from(attribute).where(isNull(attribute.deletedAt)),
        ]);

        const data = catalogOverviewSchema.parse({
          totalProducts: Number(totalProductsRaw ?? 0),
          totalProductVariants: Number(totalProductVariantsRaw ?? 0),
          totalCategories: Number(totalCategoriesRaw ?? 0),
          totalSubcategories: Number(totalSubcategoriesRaw ?? 0),
          totalAttributes: Number(totalAttributesRaw ?? 0),
        });

        return API_RESPONSE(STATUS.SUCCESS, "Catalog overview fetched successfully.", data, undefined);
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, "Failed to fetch catalog overview.", null, err as Error);
      }
    }),
});
