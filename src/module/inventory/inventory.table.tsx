"use client";

import { Book, PencilIcon, Tag } from "lucide-react";
import { EmptyState } from "@/shared/components/common/empty-state";
import { DataTable } from "@/shared/components/table/data-table";
import { filters as tableFilters } from "@/shared/components/table/data-table-filter.config";
import { useInventoryBulkActions } from "./inventory.bulk-actions";
import { useInventoryColumns } from "./inventory.columns";
import type { GetInventoriesOutput } from "./inventory.types";

export default function InventoryTable({ data }: { data: GetInventoriesOutput }) {
  const columns = useInventoryColumns();
  const bulkActions = useInventoryBulkActions();

  const items = data?.data ?? [];
  const pageCount = data?.meta?.pagination?.totalPages;
  const rowCount = data?.meta?.pagination?.total;

  return (
    <DataTable
      data={items}
      columns={columns}
      displayKey={"sku"}
      deletionOptions={tableFilters.deletionStatus}
      bulkActions={bulkActions}
      pageCount={pageCount}
      rowCount={rowCount}
      emptyState={{
        title: "No Inventory Found",
        description: "You don't have any inventory records yet.",
        icons: [Book, PencilIcon, Tag],
        action: {
          label: "Create Inventory",
          url: "/studio/inventory/new",
        },
      }}
    />
  );
}
