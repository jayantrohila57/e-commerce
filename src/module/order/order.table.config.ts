import { PATH } from "@/shared/config/routes";

export const orderTableConfig = {
  routes: {
    base: PATH.STUDIO.ORDERS.ROOT,
    view: (id: string) => PATH.STUDIO.ORDERS.VIEW(id),
  },
  fields: {
    id: "id",
    status: "status",
    placedAt: "placedAt",
  },
} as const;
