import { PATH } from "@/shared/config/routes";

export const subcategoryTableConfig = {
  routes: {
    studio: PATH.STUDIO.SUB_CATEGORIES.ROOT,
  },
  fields: {
    id: "id",
    slug: "slug",
    title: "title",
    categorySlug: "categorySlug",
  },
} as const;
