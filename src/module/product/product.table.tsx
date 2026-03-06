"use client";

import { Book, PencilIcon, Tag } from "lucide-react";
import { EmptyState } from "@/shared/components/common/empty-state";
import { DataTable } from "@/shared/components/table/data-table";
import { filters as tableFilters } from "@/shared/components/table/data-table-filter.config";
import { useProductBulkActions } from "./product.bulk-actions";
import { useProductColumns } from "./product.columns";
import type { GetManyProductsOutput } from "./product.types";

export default function ProductTable({ data }: { data: GetManyProductsOutput }) {
  const columns = useProductColumns();
  const bulkActions = useProductBulkActions();

  const items = data?.data ?? [];
  const pageCount = data?.meta?.pagination?.totalPages;
  const rowCount = data?.meta?.pagination?.total;

  if (items.length === 0) {
    return (
      <EmptyState
        title="No Products Found"
        description="You don't have any products yet. Products are required to sell items in your store."
        icons={[Book, PencilIcon, Tag]}
        action={{
          label: "Create Product",
          url: "/studio/products/new",
        }}
      />
    );
  }

  return (
    <DataTable
      data={items}
      columns={columns}
      displayKey={"title"}
      // reuse deletion filter only; status/type filters are category-specific
      deletionOptions={tableFilters.deletionStatus}
      bulkActions={bulkActions}
      pageCount={pageCount}
      rowCount={rowCount}
    />
  );
}
