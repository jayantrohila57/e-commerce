"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { DataTableColumnHeader } from "@/shared/components/table/data-table-column-header";
import { commonColumns } from "@/shared/components/table/data-table-columns";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/utils/lib/utils";
import type { Shipment, shipmentStatusEnum } from "./shipment.schema";
import { shipmentTableConfig } from "./shipment.table.config";

const statusColors: Record<ReturnType<(typeof shipmentStatusEnum)["parse"]>, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  label_created: "bg-sky-100 text-sky-800 border-sky-200",
  picked_up: "bg-sky-100 text-sky-800 border-sky-200",
  in_transit: "bg-sky-100 text-sky-800 border-sky-200",
  out_for_delivery: "bg-blue-100 text-blue-800 border-blue-200",
  delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
  exception: "bg-rose-100 text-rose-800 border-rose-200",
  returned: "bg-slate-100 text-slate-800 border-slate-200",
};

export function useShipmentColumns() {
  const router = useRouter();

  return useMemo(() => {
    const handleView = (row: Row<Shipment>) => {
      const id = row.getValue(shipmentTableConfig.fields.id);
      if (id && typeof id === "string") {
        router.push(shipmentTableConfig.routes.view(id) as Route);
      }
    };

    const baseColumns: ColumnDef<Shipment>[] = [
      {
        accessorKey: shipmentTableConfig.fields.id,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Shipment" />,
        cell: ({ row }) => {
          const id = String(row.getValue(shipmentTableConfig.fields.id) ?? "");
          const label = id ? `Shipment #${id.slice(0, 8)}` : "Shipment";

          return (
            <button
              type="button"
              onClick={() => {
                if (id) {
                  router.push(shipmentTableConfig.routes.view(id) as Route);
                }
              }}
              className="w-[220px] truncate text-left text-sm font-medium underline-offset-4 hover:underline"
            >
              {label}
            </button>
          );
        },
      },
      {
        accessorKey: "orderId",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Order" />,
        cell: ({ row }) => {
          const orderId = String(row.getValue("orderId") ?? "");

          if (!orderId) {
            return <div className="w-[200px] text-xs text-muted-foreground">—</div>;
          }

          return (
            <button
              type="button"
              onClick={() => {
                router.push(("/studio/orders/" + orderId) as Route);
              }}
              className="w-[220px] truncate text-left text-xs font-medium text-primary underline-offset-4 hover:underline"
            >
              Order #{orderId.slice(0, 8)}
            </button>
          );
        },
      },
      {
        accessorKey: "trackingNumber",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tracking Number" />,
        cell: ({ row }) => (
          <div className="w-[200px] truncate text-xs text-muted-foreground">
            {row.getValue("trackingNumber") ?? "—"}
          </div>
        ),
      },
      {
        accessorKey: "carrier",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Carrier" />,
        cell: ({ row }) => (
          <div className="w-[160px] truncate text-xs text-muted-foreground">{row.getValue("carrier") ?? "—"}</div>
        ),
      },
      {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => {
          const status = row.getValue("status") as Shipment["status"];
          return (
            <div className="w-[120px]">
              <Badge
                variant="outline"
                className={cn("border px-2 py-0.5 text-xs capitalize", statusColors[status] ?? "")}
              >
                {status.replace("_", " ")}
              </Badge>
            </div>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
        cell: ({ row }) => {
          const date = row.getValue("createdAt") as Date;
          return (
            <div className="w-[160px] text-xs text-muted-foreground">
              {date ? new Date(date).toLocaleString() : "—"}
            </div>
          );
        },
      },
    ];

    return [
      ...commonColumns.selectColumn<Shipment>(),
      ...baseColumns,
      ...commonColumns.actionsColumn<Shipment>({
        onView: handleView,
      }),
    ];
  }, [router]);
}
