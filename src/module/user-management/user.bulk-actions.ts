"use client";

import { Ban, Shield, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import type { AppRole } from "@/core/auth/auth.roles";
import { apiClient } from "@/core/api/api.client";
import type { BulkAction } from "@/shared/components/table/custom-action/bulk-operations.factory";
import type { StudioManagedUser } from "./user-management.types";

export function useUserBulkActions(): BulkAction<StudioManagedUser>[] {
  const router = useRouter();
  const utils = apiClient.useUtils();

  const refresh = async () => {
    // No direct tRPC cache; rely on page reload
    router.refresh();
  };

  // These actions invoke server actions via fetch-based API routes if needed.
  // For now, we wire role changes and ban/unban via the auth API indirectly.

  const setRole = async (role: AppRole, users: StudioManagedUser[]) => {
    await Promise.all(
      users.map(async (user) => {
        await fetch("/api/admin/users/set-role", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, role }),
        });
      }),
    );
  };

  const banUsers = async (users: StudioManagedUser[]) => {
    await Promise.all(
      users.map(async (user) => {
        await fetch("/api/admin/users/ban", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        });
      }),
    );
  };

  return [
    {
      id: "make_staff",
      label: "Make Staff",
      icon: Shield,
      variant: "default",
      requiresConfirmation: true,
      confirmationMessage: (rows) => `Promote ${rows.length} user${rows.length !== 1 ? "s" : ""} to staff?`,
      run: async (rows) => {
        await setRole("STAFF", rows);
        await refresh();
      },
    },
    {
      id: "make_admin",
      label: "Make Admin",
      icon: ShieldCheck,
      variant: "secondary",
      requiresConfirmation: true,
      confirmationMessage: (rows) => `Promote ${rows.length} user${rows.length !== 1 ? "s" : ""} to admin?`,
      run: async (rows) => {
        await setRole("ADMIN", rows);
        await refresh();
      },
    },
    {
      id: "ban",
      label: "Ban Users",
      icon: Ban,
      variant: "destructive",
      requiresConfirmation: true,
      confirmationMessage: (rows) => `Ban ${rows.length} user${rows.length !== 1 ? "s" : ""}? They will lose access.`,
      run: async (rows) => {
        await banUsers(rows);
        await refresh();
      },
    },
  ];
}
