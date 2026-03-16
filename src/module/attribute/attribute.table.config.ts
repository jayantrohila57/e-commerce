import { PATH } from "@/shared/config/routes";

export const attributeTableConfig = {
  routes: {
    base: PATH.STUDIO.ATTRIBUTES.ROOT,
    new: PATH.STUDIO.ATTRIBUTES.NEW,
    studio: PATH.STUDIO.ATTRIBUTES.VIEW,
    viewStorePrefix: PATH.STORE.ATTRIBUTES.ROOT,
    edit: (slug: string, id: string) => PATH.STUDIO.ATTRIBUTES.EDIT(slug, id),
  },
  fields: {
    id: "id",
    slug: "slug",
    title: "title",
    value: "value",
  },
} as const;
