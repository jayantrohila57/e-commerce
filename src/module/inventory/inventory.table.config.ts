import { PATH } from "@/shared/config/routes";

export const inventoryTableConfig = {
  routes: {
    base: PATH.STUDIO.INVENTORY.ROOT,
    view: (id: string) => PATH.STUDIO.INVENTORY.SLUG(id),
  },
  fields: {
    id: "id",
    sku: "sku",
    quantity: "quantity",
  },
} as const;
