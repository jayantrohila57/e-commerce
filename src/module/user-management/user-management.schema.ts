import z from "zod/v3";
import { APP_ROLE } from "@/core/auth/auth.roles";

export const userManagementRoleEnum = z.enum([APP_ROLE.ADMIN, APP_ROLE.STAFF, APP_ROLE.CUSTOMER]);

export const userManagementPermissionEnum = z.enum([
  "catalog",
  "inventory",
  "orders",
  "payments",
  "shipment",
  "checkout",
  "cart",
  "wishlist",
  "address",
  "user",
]);

export const userManagementContract = {
  listUsers: {
    input: z.object({
      query: z
        .object({
          searchValue: z.string().optional(),
          searchField: z.enum(["name", "email"]).optional(),
          searchOperator: z.enum(["contains", "starts_with", "ends_with"]).optional(),
          limit: z.number().min(1).max(100).optional(),
          offset: z.number().min(0).optional(),
          sortBy: z.enum(["name", "email", "createdAt", "updatedAt", "role"]).optional(),
          sortDirection: z.enum(["asc", "desc"]).optional(),
          filterField: z.enum(["id", "name", "email", "role"]).optional(),
          filterValue: z.string().optional(),
          filterOperator: z.enum(["eq", "contains", "ne", "lt", "lte", "gt", "gte"]).optional(),
          banned: z.boolean().optional(),
          emailVerified: z.boolean().optional(),
        })
        .default({}),
    }),
  },
  getUser: {
    input: z.object({
      params: z.object({
        id: z.string().min(1),
      }),
    }),
  },
  setRole: {
    input: z.object({
      userId: z.string().min(1),
      role: userManagementRoleEnum,
    }),
  },
  setPermissions: {
    input: z.object({
      userId: z.string().min(1),
      role: userManagementRoleEnum,
      permissions: z.array(userManagementPermissionEnum).default([]),
    }),
  },
  banUser: {
    input: z.object({
      userId: z.string().min(1),
      banReason: z.string().min(1).max(500).optional(),
      banExpiresIn: z.number().int().positive().optional(),
    }),
  },
  unbanUser: {
    input: z.object({
      userId: z.string().min(1),
    }),
  },
};
