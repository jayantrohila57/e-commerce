"use client";

import type { Row } from "@tanstack/react-table";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";
import { apiClient } from "@/core/api/api.client";
import { commonColumns } from "@/shared/components/table/data-table-columns";
import { STATUS } from "@/shared/config/api.config";
import { categoryTableConfig } from "./category.table.config";
import type { CategoryBase } from "./category.types";

const baseCategoryColumns = [
  ...commonColumns.selectColumn<CategoryBase>(),
  ...commonColumns.idColumn<CategoryBase>(),
  ...commonColumns.titleColumn<CategoryBase>(),
  ...commonColumns.slugColumn<CategoryBase>(categoryTableConfig.routes.viewStorePrefix),
  ...commonColumns.descriptionColumn<CategoryBase>(),
  ...commonColumns.displayTypeColumn<CategoryBase>(),
  ...commonColumns.visibilityColumn<CategoryBase>(),
  ...commonColumns.isFeaturedColumn<CategoryBase>(),
  ...commonColumns.colorColumn<CategoryBase>(),
  ...commonColumns.createdAtColumn<CategoryBase>(),
  ...commonColumns.updatedAtColumn<CategoryBase>(),
];

export function useCategoryColumns() {
  const router = useRouter();
  const utils = apiClient.useUtils();

  const deleteCategory = apiClient.category.delete.useMutation({
    onSuccess: async ({ status, message }) => {
      if (status === STATUS.SUCCESS) {
        toast.success(message);
        await utils.category.getMany.invalidate();
      } else {
        toast.error(message);
      }
    },
    onError: (err) => toast.error(err.message),
  });

  return useMemo(() => {
    const handleView = (row: Row<CategoryBase>) => {
      const slug = row.getValue(categoryTableConfig.fields.slug);
      if (slug && typeof slug === "string") {
        window.open(`${categoryTableConfig.routes.viewStorePrefix}/${slug}`, "_blank");
      }
    };

    const handleEdit = (row: Row<CategoryBase>) => {
      const slug = row.getValue(categoryTableConfig.fields.slug);
      const id = row.getValue(categoryTableConfig.fields.id);
      if (slug && typeof slug === "string" && id && typeof id === "string") {
        router.push(categoryTableConfig.routes.editBySlug(slug, id) as Route);
      }
    };

    const handleDelete = (row: Row<CategoryBase>) => {
      const id = row.getValue(categoryTableConfig.fields.id);
      const title = String(row.getValue(categoryTableConfig.fields.title) ?? "this category");
      if (id && typeof id === "string") {
        if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
          deleteCategory.mutate({ params: { id } });
        }
      }
    };

    return [
      ...baseCategoryColumns,
      ...commonColumns.actionsColumn<CategoryBase>({
        deleteMutation: deleteCategory,
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDelete,
      }),
    ];
  }, [deleteCategory, router]);
}
