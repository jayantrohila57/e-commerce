"use client";

import { useState, useTransition } from "react";
import { APP_ROLE, APP_ROLES, type AppRole } from "@/core/auth/auth.roles";
import { Button } from "@/shared/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { setUserRoleAction } from "../actions/user-management.actions";

type UserRoleFormProps = {
  userId: string;
  role: AppRole;
};

export function UserRoleForm({ userId, role }: UserRoleFormProps) {
  const [nextRole, setNextRole] = useState<AppRole>(role);
  const [isPending, startTransition] = useTransition();

  const disabled = isPending || nextRole === role;

  return (
    <div className="flex items-center gap-2">
      <Select value={nextRole} onValueChange={(value) => setNextRole(value as AppRole)}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          {APP_ROLES.map((value) => (
            <SelectItem key={value} value={value}>
              {value === APP_ROLE.ADMIN ? "Admin" : value === APP_ROLE.STAFF ? "Staff" : "Customer"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        size="sm"
        disabled={disabled}
        onClick={() =>
          startTransition(async () => {
            await setUserRoleAction({
              userId,
              role: nextRole,
            });
          })
        }
      >
        {isPending ? "Saving..." : "Save Role"}
      </Button>
    </div>
  );
}
