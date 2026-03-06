"use client";

import type { Row } from "@tanstack/react-table";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";
import { apiClient } from "@/core/api/api.client";
import { commonColumns } from "@/shared/components/table/data-table-columns";
import { STATUS } from "@/shared/config/api.config";
import { productTableConfig } from "./product.table.config";
import type { ProductBase } from "./product.types";

export function useProductColumns() {
  const router = useRouter();
  const utils = apiClient.useUtils();

  const deleteProduct = apiClient.product.delete.useMutation({
    onSuccess: async ({ status, message }) => {
      if (status === STATUS.SUCCESS) {
        toast.success(message);
        await utils.product.getMany.invalidate();
      } else {
        toast.error(message);
      }
    },
    onError: (err) => toast.error(err.message),
  });

  return useMemo(() => {
    const handleView = (row: Row<ProductBase>) => {
      const slug = row.getValue(productTableConfig.fields.slug);
      if (slug && typeof slug === "string") {
        window.open(`${productTableConfig.routes.viewStorePrefix}/${slug}`, "_blank");
      }
    };

    const handleEdit = (row: Row<ProductBase>) => {
      const slug = row.getValue(productTableConfig.fields.slug);
      const id = row.getValue(productTableConfig.fields.id);
      if (slug && typeof slug === "string" && id && typeof id === "string") {
        router.push(productTableConfig.routes.editBySlug(slug, id) as Route);
      }
    };

    const handleDelete = (row: Row<ProductBase>) => {
      const id = row.getValue(productTableConfig.fields.id);
      const title = String(row.getValue(productTableConfig.fields.title) ?? "this product");
      if (id && typeof id === "string") {
        if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
          deleteProduct.mutate({ params: { id } });
        }
      }
    };

    return [
      ...commonColumns.selectColumn<ProductBase>(),
      ...commonColumns.titleColumn<ProductBase>(productTableConfig.routes.studio),
      ...commonColumns.slugColumn<ProductBase>(productTableConfig.routes.viewStorePrefix),
      ...commonColumns.createdAtColumn<ProductBase>(),
      ...commonColumns.updatedAtColumn<ProductBase>(),
      ...commonColumns.actionsColumn<ProductBase>({
        deleteMutation: deleteProduct,
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDelete,
      }),
    ];
  }, [deleteProduct, router]);
}
