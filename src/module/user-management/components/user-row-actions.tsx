"use client";

import { useTransition } from "react";
import type { AppRole } from "@/core/auth/auth.roles";
import { Button } from "@/shared/components/ui/button";
import { banUserAction, setUserPermissionsAction, unbanUserAction } from "../actions/user-management.actions";

type UserRowActionsProps = {
  userId: string;
  isBanned: boolean;
  role: AppRole;
};

export function UserRowActions({ userId, isBanned, role }: UserRowActionsProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await setUserPermissionsAction({
              userId,
              role,
              permissions: [],
            });
          })
        }
      >
        {isPending ? "Applying..." : "Sync Permissions"}
      </Button>
      {isBanned ? (
        <Button
          size="sm"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await unbanUserAction({ userId });
            })
          }
        >
          {isPending ? "Updating..." : "Unban"}
        </Button>
      ) : (
        <Button
          size="sm"
          variant="destructive"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await banUserAction({
                userId,
                banReason: "Restricted by admin from Studio",
              });
            })
          }
        >
          {isPending ? "Updating..." : "Ban"}
        </Button>
      )}
    </div>
  );
}
