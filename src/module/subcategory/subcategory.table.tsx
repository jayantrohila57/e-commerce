"use client";

import { Book, PencilIcon, Tag } from "lucide-react";
import { DataTable } from "@/shared/components/table/data-table";
import { filters as tableFilters } from "@/shared/components/table/data-table-filter.config";
import { displayTypeOptions, visibilityOptions } from "@/shared/config/options.config";
import { PATH } from "@/shared/config/routes";
import { useSubcategoryBulkActions } from "./subcategory.bulk-actions";
import { useSubcategoryColumns } from "./subcategory.columns";
import type { GetSubcategoriesOutput } from "./subcategory.types";

const featuredOptions = [
  { value: "true", label: "Featured", color: "" },
  { value: "false", label: "Not Featured", color: "" },
] satisfies { value: string; label: string; color: string }[];

export default function SubcategoryTable({ data }: { data: GetSubcategoriesOutput }) {
  const columns = useSubcategoryColumns();
  const bulkActions = useSubcategoryBulkActions();

  const items = data?.data ?? [];
  const pageCount = data?.meta?.pagination?.totalPages;
  const rowCount = data?.meta?.pagination?.total;
  const currentPage = data?.meta?.pagination?.page;
  const currentLimit = data?.meta?.pagination?.limit;

  return (
    <DataTable
      data={items}
      columns={columns}
      displayKey={"title"}
      visibilityOptions={visibilityOptions}
      typeOptions={displayTypeOptions}
      featuredOptions={featuredOptions}
      deletionOptions={tableFilters.deletionStatus}
      bulkActions={bulkActions}
      pageCount={pageCount}
      rowCount={rowCount}
      initialPageIndex={typeof currentPage === "number" ? currentPage - 1 : undefined}
      initialPageSize={typeof currentLimit === "number" ? currentLimit : undefined}
      emptyState={{
        title: "No Subcategories Found",
        description: "You don't have any subcategories yet. Subcategories help you organize products.",
        icons: [Book, PencilIcon, Tag],
        action: {
          label: "Create Subcategory",
          url: PATH.STUDIO.CATEGORIES.NEW,
        },
      }}
    />
  );
}
