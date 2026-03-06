"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/utils/lib/utils";
import type { StudioManagedUser } from "./user-management.types";
import { userTableConfig } from "./user.table.config";
import { DataTableColumnHeader } from "@/shared/components/table/data-table-column-header";
import { commonColumns } from "@/shared/components/table/data-table-columns";

const roleColors: Record<string, string> = {
  ADMIN: "bg-red-100 text-red-800 border-red-200",
  STAFF: "bg-sky-100 text-sky-800 border-sky-200",
  CUSTOMER: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

export function useUserColumns() {
  const router = useRouter();

  return useMemo(() => {
    const handleView = (row: Row<StudioManagedUser>) => {
      const id = row.getValue(userTableConfig.fields.id);
      if (id && typeof id === "string") {
        router.push(userTableConfig.routes.view(id) as Route);
      }
    };

    const baseColumns: ColumnDef<StudioManagedUser>[] = [
      {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
        cell: ({ row }) => <div className="w-[200px] truncate text-sm font-medium">{row.getValue("name")}</div>,
      },
      {
        accessorKey: "email",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
        cell: ({ row }) => (
          <div className="w-[240px] truncate text-xs text-muted-foreground">{row.getValue("email")}</div>
        ),
      },
      {
        accessorKey: "role",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
        cell: ({ row }) => {
          const role = row.getValue("role") as string;
          return (
            <div className="w-[120px]">
              <Badge variant="outline" className={cn("border px-2 py-0.5 text-xs", roleColors[role] ?? "")}>
                {role.toLowerCase()}
              </Badge>
            </div>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
        cell: ({ row }) => {
          const date = row.getValue("createdAt") as Date | null;
          return (
            <div className="w-[160px] text-xs text-muted-foreground">
              {date ? new Date(date).toLocaleString() : "—"}
            </div>
          );
        },
      },
      {
        accessorKey: "banned",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Banned" />,
        cell: ({ row }) => {
          const banned = row.getValue("banned") as boolean;
          return (
            <div className="w-[80px] text-xs">
              {banned ? (
                <span className="text-rose-600 font-medium">Yes</span>
              ) : (
                <span className="text-emerald-600">No</span>
              )}
            </div>
          );
        },
      },
    ];

    return [
      ...commonColumns.selectColumn<StudioManagedUser>(),
      ...baseColumns,
      ...commonColumns.actionsColumn<StudioManagedUser>({
        onView: handleView,
      }),
    ];
  }, [router]);
}
