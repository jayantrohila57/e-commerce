"use client";

import { Percent } from "lucide-react";
import type { RouterOutputs } from "@/core/api/api.client";
import { DataTable } from "@/shared/components/table/data-table";
import { filters as tableFilters } from "@/shared/components/table/data-table-filter.config";

type DiscountListOutput = RouterOutputs["discount"]["list"];

interface DiscountTableProps {
  data: DiscountListOutput;
}

export function DiscountTable({ data }: DiscountTableProps) {
  const items = data?.data ?? [];
  const pageCount = data?.meta?.pagination?.totalPages;
  const rowCount = data?.meta?.pagination?.total;

  return (
    <DataTable
      data={items}
      columns={[
        {
          id: "code",
          header: "Code",
          accessorKey: "code",
        },
        {
          id: "type",
          header: "Type",
          accessorKey: "type",
        },
        {
          id: "value",
          header: "Value",
          cell: ({ row }) => {
            const type = row.getValue<string>("type");
            const value = row.getValue<number>("value");
            if (type === "percent") {
              return `${(value / 100).toFixed(1)}%`;
            }
            if (type === "flat") {
              return `₹${value.toLocaleString()}`;
            }
            return value;
          },
        },
        {
          id: "minOrderAmount",
          header: "Min order",
          cell: ({ row }) => {
            const value = row.getValue<number | null>("minOrderAmount") ?? 0;
            return value ? `₹${value.toLocaleString()}` : "—";
          },
        },
        {
          id: "usage",
          header: "Usage",
          cell: ({ row }) => {
            const maxUses = row.getValue<number | null>("maxUses") ?? null;
            const usedCount = row.getValue<number | null>("usedCount") ?? 0;
            return maxUses ? `${usedCount}/${maxUses}` : `${usedCount}`;
          },
        },
        {
          id: "expiresAt",
          header: "Expires",
          cell: ({ row }) => {
            const value = row.getValue<Date | null>("expiresAt");
            return value ? new Date(value).toLocaleDateString() : "No expiry";
          },
        },
        {
          id: "isActive",
          header: "Active",
          accessorKey: "isActive",
        },
      ]}
      displayKey="code"
      extraFilters={[
        {
          key: "type",
          title: "Type",
          options: [
            { label: "Percent", value: "percent", color: "" },
            { label: "Flat", value: "flat", color: "" },
          ],
        },
        {
          key: "isActive",
          title: "Status",
          options: [
            { label: "Active", value: "true", color: "" },
            { label: "Inactive", value: "false", color: "" },
          ],
        },
      ]}
      deletionOptions={tableFilters.deletionStatus}
      pageCount={pageCount}
      rowCount={rowCount}
      emptyState={{
        title: "No Discounts",
        description: "You have not created any discounts or coupons yet.",
        icons: [Percent],
        action: {
          label: "Create Discount",
          url: "/studio/discounts/new",
        },
      }}
    />
  );
}
