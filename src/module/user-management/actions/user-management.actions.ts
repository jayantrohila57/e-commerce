"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { forbidden } from "next/navigation";
import { auth } from "@/core/auth/auth";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { PATH } from "@/shared/config/routes";
import { userManagementContract } from "../user-management.schema";
import type { StudioManagedUser, StudioManagedUserList } from "../user-management.types";

type RawUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: string | null;
  banned?: boolean | null;
  banReason?: string | null;
  banExpires?: Date | string | null;
  emailVerified?: boolean | null;
  image?: string | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
  twoFactorEnabled?: boolean | null;
};

function toDate(value: Date | string | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function mapManagedUser(user: RawUser): StudioManagedUser {
  return {
    id: user.id,
    name: user.name ?? "Unknown user",
    email: user.email ?? "unknown@email.local",
    role: normalizeRole(user.role),
    banned: Boolean(user.banned),
    banReason: user.banReason ?? null,
    banExpires: toDate(user.banExpires),
    emailVerified: Boolean(user.emailVerified),
    image: user.image ?? null,
    createdAt: toDate(user.createdAt),
    updatedAt: toDate(user.updatedAt),
    twoFactorEnabled: Boolean(user.twoFactorEnabled),
  };
}

export async function requireAdminUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const role = normalizeRole(session?.user?.role);
  if (!session?.session || role !== APP_ROLE.ADMIN) {
    forbidden();
  }
  return session.user;
}

export async function getStudioUsers(input: unknown): Promise<StudioManagedUserList> {
  await requireAdminUser();
  const parsed = userManagementContract.listUsers.input.parse(input ?? { query: {} });
  const response = (await auth.api.listUsers({
    query: parsed.query,
    headers: await headers(),
  })) as {
    users?: RawUser[];
    total?: number;
    limit?: number;
    offset?: number;
  };

  const users = (response.users ?? []).map(mapManagedUser);
  return {
    users,
    total: response.total ?? users.length,
    limit: response.limit ?? parsed.query.limit ?? users.length,
    offset: response.offset ?? parsed.query.offset ?? 0,
  };
}

export async function getStudioUserById(input: unknown): Promise<StudioManagedUser | null> {
  await requireAdminUser();
  const parsed = userManagementContract.getUser.input.parse(input);
  const list = await getStudioUsers({
    query: {
      filterField: "id",
      filterOperator: "eq",
      filterValue: parsed.params.id,
      limit: 1,
      offset: 0,
    },
  });
  if (list.users[0]) return list.users[0];
  const fallback = await getStudioUsers({ query: { limit: 200, offset: 0 } });
  return fallback.users.find((user) => user.id === parsed.params.id) ?? null;
}

export async function setUserRoleAction(input: unknown) {
  await requireAdminUser();
  const parsed = userManagementContract.setRole.input.parse(input);
  await auth.api.setRole({
    body: {
      userId: parsed.userId,
      role: parsed.role,
    },
    headers: await headers(),
  });
  revalidatePath(PATH.STUDIO.USERS.ROOT);
  revalidatePath(PATH.STUDIO.USERS.VIEW(parsed.userId));
}

export async function setUserPermissionsAction(input: unknown) {
  await requireAdminUser();
  const parsed = userManagementContract.setPermissions.input.parse(input);
  await auth.api.setRole({
    body: {
      userId: parsed.userId,
      role: parsed.role,
    },
    headers: await headers(),
  });
  revalidatePath(PATH.STUDIO.USERS.ROOT);
  revalidatePath(PATH.STUDIO.USERS.VIEW(parsed.userId));
}

export async function banUserAction(input: unknown) {
  await requireAdminUser();
  const parsed = userManagementContract.banUser.input.parse(input);
  await auth.api.banUser({
    body: {
      userId: parsed.userId,
      banReason: parsed.banReason,
      banExpiresIn: parsed.banExpiresIn,
    },
    headers: await headers(),
  });
  revalidatePath(PATH.STUDIO.USERS.ROOT);
  revalidatePath(PATH.STUDIO.USERS.VIEW(parsed.userId));
}

export async function unbanUserAction(input: unknown) {
  await requireAdminUser();
  const parsed = userManagementContract.unbanUser.input.parse(input);
  await auth.api.unbanUser({
    body: {
      userId: parsed.userId,
    },
    headers: await headers(),
  });
  revalidatePath(PATH.STUDIO.USERS.ROOT);
  revalidatePath(PATH.STUDIO.USERS.VIEW(parsed.userId));
}
