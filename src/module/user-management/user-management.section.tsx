"use client";

import type { Route } from "next";
import Link from "next/link";
import { APP_ROLE, type AppRole } from "@/core/auth/auth.roles";
import { FormSection } from "@/shared/components/form/form.helper";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { PATH } from "@/shared/config/routes";
import { cn } from "@/shared/utils/lib/utils";
import { UserRoleForm } from "./components/user-role-form";
import { UserRowActions } from "./components/user-row-actions";
import { PERMISSIONS_BY_ROLE } from "./user-management.permissions";
import type { StudioManagedUser } from "./user-management.types";

function UserPermissions({ role }: { role: StudioManagedUser["role"] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {PERMISSIONS_BY_ROLE[role].map((permission) => (
        <Badge key={permission} variant="outline" className="text-xs">
          {permission}
        </Badge>
      ))}
    </div>
  );
}

const ROLE_TITLES: Record<AppRole, string> = {
  [APP_ROLE.ADMIN]: "Admins",
  [APP_ROLE.STAFF]: "Staff",
  [APP_ROLE.USER]: "Users",
  [APP_ROLE.CUSTOMER]: "Customers",
};

export function UserManagementSection({ users, description }: { users: StudioManagedUser[]; description: string }) {
  const usersByRole: Record<AppRole, StudioManagedUser[]> = {
    [APP_ROLE.ADMIN]: [],
    [APP_ROLE.STAFF]: [],
    [APP_ROLE.USER]: [],
    [APP_ROLE.CUSTOMER]: [],
  };

  for (const user of users) {
    if (usersByRole[user.role]) {
      usersByRole[user.role].push(user);
    }
  }

  const orderedRoles: AppRole[] = [APP_ROLE.ADMIN, APP_ROLE.STAFF, APP_ROLE.USER, APP_ROLE.CUSTOMER];

  return (
    <div className="flex flex-col gap-2">
      {orderedRoles.map((role, index) => {
        const roleUsers = usersByRole[role];

        return (
          <div key={role}>
            {index > 0 && <Separator className="my-2" />}
            <FormSection title={`${ROLE_TITLES[role]} (${roleUsers.length})`} description={description}>
              <div className="flex flex-col gap-2">
                {roleUsers.length === 0 ? (
                  <p className="px-2 py-4 text-sm text-muted-foreground">No users found.</p>
                ) : (
                  roleUsers.map((user) => (
                    <div key={user.id} className="rounded-md border bg-card/40 p-3">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1">
                          <Link
                            href={PATH.STUDIO.CUSTOMERS.VIEW(user.id) as Route}
                            className="font-medium hover:underline"
                          >
                            {user.name}
                          </Link>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="capitalize">
                              {user.role}
                            </Badge>
                            <Badge variant={user.emailVerified ? "default" : "outline"}>
                              {user.emailVerified ? "Verified" : "Unverified"}
                            </Badge>
                            <Badge
                              variant={user.banned ? "destructive" : "outline"}
                              className={cn("capitalize", !user.banned && "text-emerald-600")}
                            >
                              {user.banned ? "Banned" : "Active"}
                            </Badge>
                          </div>
                        </div>
                        <UserRoleForm userId={user.id} role={user.role} />
                      </div>
                      <Separator className="my-3" />
                      <div className="flex flex-col gap-2">
                        <UserPermissions role={user.role} />
                        <UserRowActions userId={user.id} isBanned={user.banned} role={user.role} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </FormSection>
          </div>
        );
      })}
    </div>
  );
}
