import type z from "zod/v3";
import type { AppRole } from "@/core/auth/auth.roles";
import type { userManagementContract } from "./user-management.schema";

export type UserManagementListInput = z.infer<typeof userManagementContract.listUsers.input>;
export type UserManagementSetRoleInput = z.infer<typeof userManagementContract.setRole.input>;
export type UserManagementSetPermissionsInput = z.infer<typeof userManagementContract.setPermissions.input>;
export type UserManagementBanInput = z.infer<typeof userManagementContract.banUser.input>;
export type UserManagementUnbanInput = z.infer<typeof userManagementContract.unbanUser.input>;

export type StudioManagedUser = {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  banned: boolean;
  banReason: string | null;
  banExpires: Date | null;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  twoFactorEnabled: boolean;
};

export type StudioManagedUserList = {
  users: StudioManagedUser[];
  total: number;
  limit: number;
  offset: number;
};
