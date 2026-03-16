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
import { OrderCustomerCell } from "./components/order-customer-cell";
import type { Order, orderStatusEnum } from "./order.schema";
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
      {
        accessorKey: orderTableConfig.fields.id,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Order" />,
        cell: ({ row }) => {
          const id = String(row.getValue(orderTableConfig.fields.id) ?? "");
          const label = id ? `Order #${id.slice(0, 8)}` : "Order";

          return (
            <button
              type="button"
              onClick={() => {
                if (id) {
                  router.push(orderTableConfig.routes.view(id) as Route);
                }
              }}
              className="w-[200px] truncate text-left text-sm font-medium underline-offset-4 hover:underline"
            >
              {label}
            </button>
          );
        },
      },
      ...commonColumns.currencyColumn<Order>(),
      {
        accessorKey: "userId",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
        cell: ({ row }) => {
          const order = row.original as Order;
          return <OrderCustomerCell order={order} />;
        },
      },
      {
        accessorKey: "grandTotal",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Total" />,
        cell: ({ row }) => {
          const total = row.getValue("grandTotal") as number;
          const currency = (row.getValue("currency") as string) ?? "INR";
          const displayAmount = (total / 100).toFixed(2);
          return <div className="w-[120px] text-sm font-medium">{`${currency} ${displayAmount}`}</div>;
        },
      },
      {
        id: "shippingSummary",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Shipping" />,
        cell: ({ row }) => {
          const providerId = row.getValue("shippingProviderId") as string | null | undefined;
          const methodId = row.getValue("shippingMethodId") as string | null | undefined;
          const zoneId = row.getValue("shippingZoneId") as string | null | undefined;
          const warehouseId = (row.original as Order).warehouseId;

          if (!providerId && !methodId && !zoneId && !warehouseId) {
            return <div className="w-[220px] text-xs text-muted-foreground">—</div>;
          }

          const parts: string[] = [];
          if (providerId) parts.push(`Provider ${providerId.slice(0, 8)}`);
          if (methodId) parts.push(`Method ${methodId.slice(0, 8)}`);
          if (zoneId) parts.push(`Zone ${zoneId.slice(0, 8)}`);
          if (warehouseId) parts.push(`WH ${warehouseId.slice(0, 8)}`);

          return (
            <div className="w-[260px] truncate text-xs text-muted-foreground" title={parts.join(" • ")}>
              {parts.join(" • ")}
            </div>
          );
        },
      },
      {
        id: "payment",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Payment" />,
        cell: ({ row }) => {
          const id = row.getValue(orderTableConfig.fields.id) as string | undefined;
          if (!id) {
            return <div className="w-[140px] text-xs text-muted-foreground">—</div>;
          }

          return (
            <button
              type="button"
              onClick={() => {
                const search = new URLSearchParams({ q: id }).toString();
                window.location.href = `/studio/payment?${search}`;
              }}
              className="w-[140px] truncate text-left text-xs font-medium text-primary underline-offset-4 hover:underline"
            >
              View payments
            </button>
          );
        },
      },
      {
        id: "shipment",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Shipment" />,
        cell: ({ row }) => {
          const id = row.getValue(orderTableConfig.fields.id) as string | undefined;
          if (!id) {
            return <div className="w-[140px] text-xs text-muted-foreground">—</div>;
          }

          return (
            <button
              type="button"
              onClick={() => {
                const search = new URLSearchParams({ orderId: id }).toString();
                window.location.href = `/studio/shipping?${search}`;
              }}
              className="w-[140px] truncate text-left text-xs font-medium text-primary underline-offset-4 hover:underline"
            >
              View shipments
            </button>
          );
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
          const formatted =
            date instanceof Date && !Number.isNaN(date.getTime())
              ? `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
              : null;
          return <div className="w-[160px] text-xs text-muted-foreground">{formatted ?? "—"}</div>;
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
