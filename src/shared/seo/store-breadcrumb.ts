import "server-only";

import { cache } from "react";
import { apiServer } from "@/core/api/api.server";

/** Deduped per request (RSC + generateMetadata). */
export const getStoreCategoryTitle = cache(async (categorySlug: string) => {
  const { data } = await apiServer.category.get({
    params: { slug: categorySlug },
  });
  return data?.title ?? categorySlug;
});

export const getStoreSubcategoryTitle = cache(async (categorySlug: string, subcategorySlug: string) => {
  const { data } = await apiServer.subcategory.getBySlug({
    params: { slug: subcategorySlug, categorySlug },
  });
  return data?.subcategoryData?.title ?? subcategorySlug;
});
