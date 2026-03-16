import { PATH } from "@/shared/config/routes";

export const shipmentTableConfig = {
  routes: {
    base: PATH.STUDIO.SHIPPING.ROOT,
    view: (id: string) => PATH.STUDIO.SHIPPING.VIEW(id),
  },
  fields: {
    id: "id",
    orderId: "orderId",
    status: "status",
    trackingNumber: "trackingNumber",
  },
} as const;
