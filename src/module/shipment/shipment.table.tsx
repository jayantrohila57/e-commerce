"use client";

import { Book, PencilIcon, Tag } from "lucide-react";
import { EmptyState } from "@/shared/components/common/empty-state";
import { DataTable } from "@/shared/components/table/data-table";
import { filters as tableFilters } from "@/shared/components/table/data-table-filter.config";
import { useShipmentBulkActions } from "./shipment.bulk-actions";
import { useShipmentColumns } from "./shipment.columns";
import type { GetManyShipmentsOutput } from "./shipment.types";

export default function ShipmentTable({ data }: { data: GetManyShipmentsOutput }) {
  const columns = useShipmentColumns();
  const bulkActions = useShipmentBulkActions();

  const items = data?.data ?? [];
  const pageCount = data?.meta?.pagination?.totalPages;
  const rowCount = data?.meta?.pagination?.total;

  return (
    <DataTable
      data={items}
      columns={columns}
      displayKey={"trackingNumber"}
      deletionOptions={tableFilters.deletionStatus}
      bulkActions={bulkActions}
      pageCount={pageCount}
      rowCount={rowCount}
      emptyState={{
        title: "No Shipments Found",
        description: "There are no shipments yet.",
        icons: [Book, PencilIcon, Tag],
        action: {
          label: "Create Shipment",
          url: "/studio/shipments/new",
        },
      }}
    />
  );
}
