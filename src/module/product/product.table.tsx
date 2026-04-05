"use client";

import { Book, PencilIcon, Tag } from "lucide-react";
import { DataTable } from "@/shared/components/table/data-table";
import { filters as tableFilters } from "@/shared/components/table/data-table-filter.config";
import { statusOptions as productStatusOptions } from "@/shared/config/options.config";
import { PATH } from "@/shared/config/routes";
import { useProductBulkActions } from "./product.bulk-actions";
import { useProductColumns } from "./product.columns";
import type { GetManyProductsOutput } from "./product.types";

export default function ProductTable({ data }: { data: GetManyProductsOutput }) {
  const columns = useProductColumns();
  const bulkActions = useProductBulkActions();

  const items = data?.data ?? [];
  const pageCount = data?.meta?.pagination?.totalPages;
  const rowCount = data?.meta?.pagination?.total;

  return (
    <DataTable
      data={items}
      columns={columns}
      displayKey={"title"}
      statusOptions={productStatusOptions}
      extraFilters={[
        {
          key: "categorySlug",
          title: "Category",
          options: Array.from(new Set(items.map((item) => item.categorySlug))).map((slug) => ({
            label: slug,
            value: slug,
            color: "",
          })),
        },
        {
          key: "subcategorySlug",
          title: "Subcategory",
          options: Array.from(new Set(items.map((item) => item.subcategorySlug))).map((slug) => ({
            label: slug,
            value: slug,
            color: "",
          })),
        },
      ]}
      deletionOptions={tableFilters.deletionStatus}
      bulkActions={bulkActions}
      pageCount={pageCount}
      rowCount={rowCount}
      emptyState={{
        title: "No Products Found",
        description: "You don't have any products yet. Products are required to sell items in your store.",
        icons: [Book, PencilIcon, Tag],
        action: {
          label: "Create Product",
          url: PATH.STUDIO.PRODUCTS.NEW,
        },
      }}
    />
  );
}
