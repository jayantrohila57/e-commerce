"use client";

import { Book, PencilIcon, Tag } from "lucide-react";
import { EmptyState } from "@/shared/components/common/empty-state";
import { DataTable } from "@/shared/components/table/data-table";
import { filters as tableFilters } from "@/shared/components/table/data-table-filter.config";
import type { DetailedResponse } from "@/shared/schema";
import { useOrderBulkActions } from "./order.bulk-actions";
import { useOrderColumns } from "./order.columns";
import type { Order } from "./order.schema";

type AdminOrdersOutput = DetailedResponse<Order[]>;

export default function OrderTable({ data }: { data: AdminOrdersOutput }) {
  const columns = useOrderColumns();
  const bulkActions = useOrderBulkActions();

  const items = data?.data ?? [];
  const pageCount = data?.meta?.pagination?.totalPages;
  const rowCount = data?.meta?.pagination?.total;
  const currentPage = data?.meta?.pagination?.page;
  const currentLimit = data?.meta?.pagination?.limit;

  return (
    <DataTable
      data={items}
      columns={columns}
      displayKey={"id"}
      extraFilters={[
        {
          key: "status",
          title: "Status",
          options: [
            { label: "Pending", value: "pending", color: "" },
            { label: "Paid", value: "paid", color: "" },
            { label: "Shipped", value: "shipped", color: "" },
            { label: "Delivered", value: "delivered", color: "" },
            { label: "Cancelled", value: "cancelled", color: "" },
          ],
        },
        {
          key: "customerType",
          title: "Customer",
          options: [
            { label: "Registered", value: "registered", color: "" },
            { label: "Guest", value: "guest", color: "" },
          ],
        },
      ]}
      deletionOptions={tableFilters.deletionStatus}
      bulkActions={bulkActions}
      pageCount={pageCount}
      rowCount={rowCount}
      initialPageIndex={typeof currentPage === "number" ? currentPage - 1 : undefined}
      initialPageSize={typeof currentLimit === "number" ? currentLimit : undefined}
      emptyState={{
        title: "No Orders Found",
        description: "There are no orders yet.",
        icons: [Book, PencilIcon, Tag],
        action: {
          label: "Create Order",
          url: "/studio/orders/new",
        },
      }}
    />
  );
}
