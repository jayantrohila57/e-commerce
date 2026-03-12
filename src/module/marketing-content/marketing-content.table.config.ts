import { PATH } from "@/shared/config/routes";

export const marketingContentTableConfig = {
  routes: {
    base: PATH.STUDIO.MARKETING.CONTENT.ROOT,
    new: PATH.STUDIO.MARKETING.CONTENT.NEW,
    edit: (id: string) => PATH.STUDIO.MARKETING.CONTENT.EDIT(id),
  },
  fields: {
    id: "id",
    title: "title",
    page: "page",
    section: "section",
  },
} as const;
