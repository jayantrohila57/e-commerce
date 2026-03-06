import { PATH } from "@/shared/config/routes";

export const shipmentTableConfig = {
  routes: {
    base: PATH.STUDIO.SHIPPING.ROOT,
    edit: (id: string) => PATH.STUDIO.SHIPPING.EDIT(id),
  },
  fields: {
    id: "id",
    orderId: "orderId",
    status: "status",
    trackingNumber: "trackingNumber",
  },
} as const;
