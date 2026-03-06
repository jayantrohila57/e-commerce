"use client";

import { Book, PencilIcon, Tag } from "lucide-react";
import { EmptyState } from "@/shared/components/common/empty-state";
import { DataTable } from "@/shared/components/table/data-table";
import { filters as tableFilters } from "@/shared/components/table/data-table-filter.config";
import { useAttributeBulkActions } from "./attribute.bulk-actions";
import { useAttributeColumns } from "./attribute.columns";
import type { GetManyAttributesOutput } from "./attribute.types";

export default function AttributeTable({ data }: { data: GetManyAttributesOutput }) {
  const columns = useAttributeColumns();
  const bulkActions = useAttributeBulkActions();

  const items = data?.data ?? [];
  const pageCount = data?.meta?.pagination?.totalPages;
  const rowCount = data?.meta?.pagination?.total;

  if (items.length === 0) {
    return (
      <EmptyState
        title="No Attributes Found"
        description="You don't have any attributes yet."
        icons={[Book, PencilIcon, Tag]}
        action={{
          label: "Create Attribute",
          url: "/studio/products/attributes/new",
        }}
      />
    );
  }

  return (
    <DataTable
      data={items}
      columns={columns}
      displayKey={"title"}
      deletionOptions={tableFilters.deletionStatus}
      bulkActions={bulkActions}
      pageCount={pageCount}
      rowCount={rowCount}
    />
  );
}
