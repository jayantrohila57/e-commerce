import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements, userAc } from "better-auth/plugins/admin/access";
import { APP_ROLE } from "./auth.roles";

const statement = {
  ...defaultStatements,
  catalog: ["read", "create", "update", "delete"],
  inventory: ["read", "create", "update", "delete"],
  orders: ["read", "update-status", "refund"],
  payments: ["read", "refund", "capture"],
  shipment: ["read", "update"],
  checkout: ["create"],
  cart: ["read", "update"],
  wishlist: ["read", "update"],
  address: ["read", "update"],
} as const;

export const ac = createAccessControl(statement);

export const user = ac.newRole({
  ...userAc.statements,
  catalog: ["read"],
  checkout: ["create"],
  cart: ["read", "update"],
  wishlist: ["read", "update"],
  address: ["read", "update"],
});

export const customer = ac.newRole({
  ...userAc.statements,
  catalog: ["read"],
  checkout: ["create"],
  cart: ["read", "update"],
  wishlist: ["read", "update"],
  address: ["read", "update"],
  orders: ["read"],
});

export const staff = ac.newRole({
  ...userAc.statements,
  catalog: ["read", "create", "update", "delete"],
  inventory: ["read", "create", "update", "delete"],
  orders: ["read", "update-status"],
  payments: ["read", "capture"],
  shipment: ["read", "update"],
  user: ["list", "get", "update"],
});

export const admin = ac.newRole(adminAc.statements);

export const ROLE_KEY = {
  ADMIN: APP_ROLE.ADMIN,
  STAFF: APP_ROLE.STAFF,
  USER: APP_ROLE.USER,
  CUSTOMER: APP_ROLE.CUSTOMER,
} as const;
