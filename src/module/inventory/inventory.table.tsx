"use client";

import { Book, PencilIcon, Tag } from "lucide-react";
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
      extraFilters={[
        {
          key: "stockStatus",
          title: "Stock Status",
          options: [
            { label: "In Stock", value: "in_stock", color: "" },
            { label: "Low Stock", value: "low_stock", color: "" },
            { label: "Out of Stock", value: "out_of_stock", color: "" },
          ],
        },
        {
          key: "hasReserved",
          title: "Reserved",
          options: [
            { label: "Has Reserved", value: "true", color: "" },
            { label: "No Reserved", value: "false", color: "" },
          ],
        },
        {
          key: "hasIncoming",
          title: "Incoming",
          options: [
            { label: "Has Incoming", value: "true", color: "" },
            { label: "No Incoming", value: "false", color: "" },
          ],
        },
      ]}
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
