"use server";

import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { forbidden } from "next/navigation";
import { auth } from "@/core/auth/auth";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { db } from "@/core/db/db";
import { user as userTable } from "@/core/db/db.schema";
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

function buildStudioUserDbWhere(query: {
  filterField?: "id" | "name" | "email" | "role";
  filterValue?: string;
  searchValue?: string;
  banned?: boolean;
  emailVerified?: boolean;
}) {
  const conditions = [];
  if (query.filterField === "role" && query.filterValue) {
    conditions.push(eq(userTable.role, query.filterValue));
  }
  if (typeof query.banned === "boolean") {
    conditions.push(eq(userTable.banned, query.banned));
  }
  if (typeof query.emailVerified === "boolean") {
    conditions.push(eq(userTable.emailVerified, query.emailVerified));
  }
  if (query.searchValue) {
    const term = `%${query.searchValue}%`;
    conditions.push(or(ilike(userTable.name, term), ilike(userTable.email, term))!);
  }
  return conditions.length ? and(...conditions) : undefined;
}

export async function getStudioUsers(input: unknown): Promise<StudioManagedUserList> {
  await requireAdminUser();
  const parsed = userManagementContract.listUsers.input.parse(input ?? { query: {} });
  const q = parsed.query;

  const listViaDb = typeof q.banned === "boolean" || typeof q.emailVerified === "boolean";

  if (listViaDb) {
    const where = buildStudioUserDbWhere(q);
    const limit = q.limit ?? 20;
    const offset = q.offset ?? 0;
    const [{ count: totalRaw = 0 } = { count: 0 }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(userTable)
      .where(where);
    const total = Number(totalRaw ?? 0);
    const rows = await db
      .select()
      .from(userTable)
      .where(where)
      .orderBy(desc(userTable.createdAt))
      .limit(limit)
      .offset(offset);
    const users = rows.map((row) =>
      mapManagedUser({
        id: row.id,
        name: row.name,
        email: row.email,
        role: row.role,
        banned: row.banned,
        banReason: row.banReason,
        banExpires: row.banExpires,
        emailVerified: row.emailVerified,
        image: row.image,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        twoFactorEnabled: row.twoFactorEnabled,
      }),
    );
    return {
      users,
      total,
      limit,
      offset,
    };
  }

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
