import { PATH } from "@/shared/config/routes";

export const paymentTableConfig = {
  routes: {
    base: PATH.STUDIO.PAYMENT.ROOT,
    view: (id: string) => PATH.STUDIO.PAYMENT.VIEW(id),
  },
  fields: {
    id: "id",
    orderId: "orderId",
    provider: "provider",
    status: "status",
    amount: "amount",
    currency: "currency",
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  },
} as const;
