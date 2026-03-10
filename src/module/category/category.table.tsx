"use client";

import { Book, PencilIcon, Tag } from "lucide-react";
import type { ComponentType } from "react";
import { DataTable } from "@/shared/components/table/data-table";
import { filters as tableFilters } from "@/shared/components/table/data-table-filter.config";
import type { FilterOption } from "@/shared/config/options.config";
import { displayTypeOptions, visibilityOptions } from "@/shared/config/options.config";
import { PATH } from "@/shared/config/routes";
import { useCategoryBulkActions } from "./category.bulk-actions";
import { useCategoryColumns } from "./category.columns";
import type { GetCategoriesOutput } from "./category.types";

const featuredOptions = [
  { value: "true", label: "Featured", color: "" },
  { value: "false", label: "Not Featured", color: "" },
] satisfies { value: string; label: string; color: string }[];

function toFacetOptions<T extends string>(
  options: FilterOption<T>[],
): { value: string; label: string; color: string; icon?: ComponentType<{ className?: string }> }[] {
  return options.map((o) => ({
    value: String(o.value),
    label: o.label,
    color: o.color,
    icon: o.icon,
  }));
}

export default function CategoryTable({ data }: { data: GetCategoriesOutput }) {
  const columns = useCategoryColumns();
  const bulkActions = useCategoryBulkActions();

  const items = data?.data ?? [];
  const pageCount = data?.meta?.pagination?.totalPages;
  const rowCount = data?.meta?.pagination?.total;

  return (
    <DataTable
      data={items}
      columns={columns}
      displayKey={"title"}
      visibilityOptions={toFacetOptions(visibilityOptions)}
      typeOptions={toFacetOptions(displayTypeOptions)}
      featuredOptions={featuredOptions}
      deletionOptions={tableFilters.deletionStatus}
      bulkActions={bulkActions}
      pageCount={pageCount}
      rowCount={rowCount}
      emptyState={{
        title: "No Categories Found",
        description: "You don't have any categories yet. Categories help you organize products.",
        icons: [Book, PencilIcon, Tag],
        action: {
          label: "Create Category",
          url: PATH.STUDIO.CATEGORIES.NEW,
        },
      }}
    />
  );
}
