"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { DataTableColumnHeader } from "@/shared/components/table/data-table-column-header";
import { commonColumns } from "@/shared/components/table/data-table-columns";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/utils/lib/utils";
import type { Payment } from "./payment.schema";
import { paymentTableConfig } from "./payment.table.config";

const statusColors: Record<Payment["status"], string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  failed: "bg-rose-100 text-rose-800 border-rose-200",
  refunded: "bg-blue-100 text-blue-800 border-blue-200",
};

const providerIcons: Record<Payment["provider"], string> = {
  stripe: "Stripe",
  razorpay: "Razorpay",
  paypal: "PayPal",
  cod: "COD",
};

export function usePaymentColumns() {
  const router = useRouter();

  return useMemo(() => {
    const handleView = (row: Row<Payment>) => {
      const id = row.getValue(paymentTableConfig.fields.id);
      if (id && typeof id === "string") {
        router.push(paymentTableConfig.routes.view(id) as Route);
      }
    };

    const baseColumns: ColumnDef<Payment>[] = [
      ...commonColumns.idColumn<Payment>(),
      {
        accessorKey: "orderId",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Order ID" />,
        cell: ({ row }) => {
          const orderId = String(row.getValue("orderId"));
          return <div className="w-[200px] truncate text-xs text-muted-foreground">{orderId}</div>;
        },
      },
      {
        accessorKey: "provider",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Provider" />,
        cell: ({ row }) => {
          const provider = row.getValue("provider") as Payment["provider"];
          return (
            <div className="w-[100px]">
              <Badge variant="outline" className="text-xs">
                {providerIcons[provider] ?? provider}
              </Badge>
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => {
          const status = row.getValue("status") as Payment["status"];
          return (
            <div className="w-[100px]">
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
        accessorKey: "amount",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
        cell: ({ row }) => {
          const amount = row.getValue("amount") as number;
          const currency = (row.getValue("currency") as string) ?? "INR";
          // Convert from smallest currency unit to display format
          const displayAmount = (amount / 100).toFixed(2);
          return (
            <div className="w-[120px] text-sm font-medium">
              {currency} {displayAmount}
            </div>
          );
        },
      },
      ...commonColumns.currencyColumn<Payment>(),
      ...commonColumns.createdAtColumn<Payment>(),
      ...commonColumns.updatedAtColumn<Payment>(),
    ];

    return [
      ...commonColumns.selectColumn<Payment>(),
      ...baseColumns,
      ...commonColumns.actionsColumn<Payment>({
        onView: handleView,
      }),
    ];
  }, [router]);
}
