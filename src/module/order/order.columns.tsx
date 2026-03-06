"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { apiClient } from "@/core/api/api.client";
import { DataTableColumnHeader } from "@/shared/components/table/data-table-column-header";
import { commonColumns } from "@/shared/components/table/data-table-columns";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/utils/lib/utils";
import type { Order } from "./order.schema";
import type { orderStatusEnum } from "./order.schema";
import { orderTableConfig } from "./order.table.config";

const statusColors: Record<ReturnType<(typeof orderStatusEnum)["parse"]>, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  paid: "bg-emerald-100 text-emerald-800 border-emerald-200",
  shipped: "bg-sky-100 text-sky-800 border-sky-200",
  delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
  cancelled: "bg-rose-100 text-rose-800 border-rose-200",
};

export function useOrderColumns() {
  const router = useRouter();

  const utils = apiClient.useUtils();

  const updateStatus = apiClient.order.updateStatus.useMutation({
    onSuccess: async () => {
      await utils.order.getManyAdmin.invalidate();
      router.refresh();
    },
  });

  return useMemo(() => {
    const handleView = (row: Row<Order>) => {
      const id = row.getValue(orderTableConfig.fields.id);
      if (id && typeof id === "string") {
        router.push(orderTableConfig.routes.view(id) as Route);
      }
    };

    const baseColumns: ColumnDef<Order>[] = [
      ...commonColumns.idColumn<Order>(),
      ...commonColumns.currencyColumn<Order>(),
      {
        accessorKey: "userId",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Customer ID" />,
        cell: ({ row }) => (
          <div className="w-[200px] truncate text-xs text-muted-foreground">{row.getValue("userId") ?? "Guest"}</div>
        ),
      },
      {
        accessorKey: "grandTotal",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Total" />,
        cell: ({ row }) => {
          const total = row.getValue("grandTotal") as number;
          const currency = (row.getValue("currency") as string) ?? "INR";
          return <div className="w-[120px] text-sm font-medium">{`${currency} ${total / 100}`}</div>;
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => {
          const status = row.getValue("status") as Order["status"];
          return (
            <div className="w-[120px]">
              <Badge
                variant="outline"
                className={cn("border px-2 py-0.5 text-xs capitalize", statusColors[status] ?? "")}
              >
                {status}
              </Badge>
            </div>
          );
        },
      },
      {
        accessorKey: "placedAt",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Placed At" />,
        cell: ({ row }) => {
          const date = row.getValue("placedAt") as Date;
          return (
            <div className="w-[160px] text-xs text-muted-foreground">
              {date ? new Date(date).toLocaleString() : "—"}
            </div>
          );
        },
      },
    ];

    return [
      ...commonColumns.selectColumn<Order>(),
      ...baseColumns,
      ...commonColumns.actionsColumn<Order>({
        onView: handleView,
      }),
    ];
  }, [router, updateStatus]);
}
