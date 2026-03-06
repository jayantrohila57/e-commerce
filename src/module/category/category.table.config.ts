import { PATH } from "@/shared/config/routes";

export const categoryTableConfig = {
  routes: {
    base: PATH.STUDIO.CATEGORIES.ROOT,
    studio: PATH.STUDIO.CATEGORIES.ROOT,
    editBySlug: (slug: string, id: string) => PATH.STUDIO.CATEGORIES.EDIT(slug, id),
    viewStorePrefix: "/store",
  },
  fields: {
    id: "id",
    slug: "slug",
    title: "title",
  },
} as const;
