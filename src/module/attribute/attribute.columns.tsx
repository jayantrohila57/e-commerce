"use client";

import type { Row } from "@tanstack/react-table";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { apiClient } from "@/core/api/api.client";
import { commonColumns } from "@/shared/components/table/data-table-columns";
import type { AttributeBase } from "./attribute.schema";
import { attributeTableConfig } from "./attribute.table.config";

export function useAttributeColumns() {
  const router = useRouter();
  const utils = apiClient.useUtils();

  const deleteAttribute = apiClient.attribute.delete.useMutation({
    onSuccess: async () => {
      await utils.attribute.getMany.invalidate();
      router.refresh();
    },
  });

  return useMemo(() => {
    const handleEdit = (row: Row<AttributeBase>) => {
      const slug = row.getValue(attributeTableConfig.fields.slug);
      const id = row.getValue(attributeTableConfig.fields.id);
      if (slug && typeof slug === "string" && id && typeof id === "string") {
        router.push(attributeTableConfig.routes.edit(slug, id) as Route);
      }
    };

    const handleDelete = (row: Row<AttributeBase>) => {
      const id = row.getValue(attributeTableConfig.fields.id);
      const title = String(row.getValue(attributeTableConfig.fields.title) ?? "this attribute");
      if (id && typeof id === "string") {
        if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
          deleteAttribute.mutate({ params: { id } });
        }
      }
    };

    const baseColumns = [
      ...commonColumns.titleColumn<AttributeBase>(attributeTableConfig.routes.studio),
      ...commonColumns.slugColumn<AttributeBase>(attributeTableConfig.routes.viewStorePrefix),
      ...commonColumns.valueColumn<AttributeBase>(),
      ...commonColumns.createdAtColumn<AttributeBase>(),
      ...commonColumns.updatedAtColumn<AttributeBase>(),
    ];

    return [
      ...commonColumns.selectColumn<AttributeBase>(),
      ...baseColumns,
      ...commonColumns.actionsColumn<AttributeBase>({
        onEdit: handleEdit,
        onDelete: handleDelete,
        deleteMutation: deleteAttribute,
      }),
    ];
  }, [deleteAttribute, router]);
}
