import { PATH } from "@/shared/config/routes";

export const productTableConfig = {
  routes: {
    base: PATH.STUDIO.PRODUCTS.ROOT,
    new: PATH.STUDIO.PRODUCTS.NEW,
    studio: PATH.STUDIO.PRODUCTS.ROOT,
    /** Subcategory PLP on the storefront (variant PDP needs a variant slug from catalog). */
    storeSubcategory: (categorySlug: string, subcategorySlug: string) =>
      PATH.STORE.SUB_CATEGORIES.SUBCATEGORY(subcategorySlug, categorySlug),
    editBySlug: (slug: string, id: string) => PATH.STUDIO.PRODUCTS.EDIT(slug, id),
  },
  fields: {
    id: "id",
    slug: "slug",
    title: "title",
  },
} as const;
