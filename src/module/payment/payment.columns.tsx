"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { DataTableColumnHeader } from "@/shared/components/table/data-table-column-header";
import { commonColumns } from "@/shared/components/table/data-table-columns";
import { Badge } from "@/shared/components/ui/badge";
import { PATH } from "@/shared/config/routes";
import { cn } from "@/shared/utils/lib/utils";
import type { Payment } from "./payment.schema";
import { paymentTableConfig } from "./payment.table.config";

const statusColors: Record<Payment["status"], string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  failed: "bg-rose-100 text-rose-800 border-rose-200",
  refunded: "bg-blue-100 text-blue-800 border-blue-200",
};

const providerLabels: Record<Payment["provider"], string> = {
  stripe: "Stripe",
  razorpay: "Razorpay",
  paypal: "PayPal",
  cod: "Cash on Delivery",
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
      {
        accessorKey: paymentTableConfig.fields.id,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Payment" />,
        cell: ({ row }) => {
          const id = String(row.getValue(paymentTableConfig.fields.id) ?? "");
          const label = id ? `Payment #${id.slice(0, 8)}` : "Payment";

          return (
            <button
              type="button"
              onClick={() => {
                if (id) {
                  router.push(paymentTableConfig.routes.view(id) as Route);
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
        accessorKey: paymentTableConfig.fields.orderId,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Order" />,
        cell: ({ row }) => {
          const orderId = String(row.getValue(paymentTableConfig.fields.orderId) ?? "");

          if (!orderId) {
            return <div className="w-[200px] text-xs text-muted-foreground">—</div>;
          }

          return (
            <button
              type="button"
              onClick={() => {
                router.push(PATH.STUDIO.ORDERS.VIEW(orderId) as Route);
              }}
              className="w-[220px] truncate text-left text-xs font-medium text-primary underline-offset-4 hover:underline"
            >
              Order #{orderId.slice(0, 8)}
            </button>
          );
        },
      },
      {
        accessorKey: paymentTableConfig.fields.provider,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Provider" />,
        cell: ({ row }) => {
          const provider = row.getValue(paymentTableConfig.fields.provider) as Payment["provider"];
          const label = providerLabels[provider] ?? provider;

          return (
            <div className="w-[140px]">
              <Badge variant="outline" className="px-2 py-0.5 text-xs">
                {label}
              </Badge>
            </div>
          );
        },
      },
      {
        accessorKey: paymentTableConfig.fields.status,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => {
          const status = row.getValue(paymentTableConfig.fields.status) as Payment["status"];
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
        accessorKey: paymentTableConfig.fields.amount,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
        cell: ({ row }) => {
          const amount = row.getValue(paymentTableConfig.fields.amount) as number;
          const currency = (row.getValue(paymentTableConfig.fields.currency) as string) ?? "INR";
          const displayAmount = (amount / 100).toFixed(2);

          return (
            <div className="w-[140px] text-sm font-medium">
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
