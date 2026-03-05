import { APP_ROLE, type AppRole } from "@/core/auth/auth.roles";

export const PERMISSIONS_BY_ROLE: Record<AppRole, string[]> = {
  [APP_ROLE.ADMIN]: [
    "user-management",
    "catalog",
    "inventory",
    "orders",
    "payments",
    "shipment",
    "checkout",
    "cart",
    "wishlist",
    "address",
  ],
  [APP_ROLE.STAFF]: ["catalog", "inventory", "orders", "payments", "shipment"],
  [APP_ROLE.USER]: ["checkout", "cart", "wishlist", "address"],
  [APP_ROLE.CUSTOMER]: ["checkout", "cart", "wishlist", "address", "own-orders"],
};
