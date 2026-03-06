import { PATH } from "@/shared/config/routes";

export const productTableConfig = {
  routes: {
    base: PATH.STUDIO.PRODUCTS.ROOT,
    new: PATH.STUDIO.PRODUCTS.NEW,
    studio: PATH.STUDIO.PRODUCTS.ROOT,
    viewStorePrefix: PATH.STORE.PRODUCTS.ROOT,
    editBySlug: (slug: string, id: string) => PATH.STUDIO.PRODUCTS.EDIT(slug, id),
  },
  fields: {
    id: "id",
    slug: "slug",
    title: "title",
  },
} as const;
