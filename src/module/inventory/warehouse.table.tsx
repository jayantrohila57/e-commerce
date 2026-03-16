"use client";

import { Warehouse } from "lucide-react";
import type { RouterOutputs } from "@/core/api/api.client";
import { DataTable } from "@/shared/components/table/data-table";
import { filters as tableFilters } from "@/shared/components/table/data-table-filter.config";

type WarehouseListOutput = RouterOutputs["warehouse"]["list"];

export function WarehouseTable({ data }: { data: WarehouseListOutput }) {
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
          id: "name",
          header: "Name",
          accessorKey: "name",
        },
        {
          id: "location",
          header: "Location",
          cell: ({ row }) => {
            const country = row.getValue<string>("country");
            const state = row.getValue<string | null>("state");
            const city = row.getValue<string | null>("city");
            return [city, state, country].filter(Boolean).join(", ") || "—";
          },
        },
        {
          id: "isActive",
          header: "Active",
          accessorKey: "isActive",
        },
      ]}
      displayKey="name"
      extraFilters={[
        {
          key: "isActive",
          title: "Active",
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
        title: "No Warehouses",
        description: "You have not configured any warehouses yet.",
        icons: [Warehouse],
        action: {
          label: "Create Warehouse",
          url: "/studio/inventory/warehouses/new",
        },
      }}
    />
  );
}
