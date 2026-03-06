"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/core/api/api.client";
import type { BulkAction } from "@/shared/components/table/custom-action/bulk-operations.factory";
import type { AttributeBase } from "./attribute.schema";

export function useAttributeBulkActions(): BulkAction<AttributeBase>[] {
  const utils = apiClient.useUtils();
  const router = useRouter();

  const del = apiClient.attribute.delete.useMutation();

  const refresh = async () => {
    await utils.attribute.getMany.invalidate();
    router.refresh();
  };

  return [
    {
      id: "delete",
      label: "Delete",
      icon: Trash2,
      variant: "destructive",
      requiresConfirmation: true,
      confirmationMessage: (rows) =>
        `Delete ${rows.length} attribute${rows.length !== 1 ? "s" : ""}? This cannot be undone.`,
      run: async (rows) => {
        await Promise.all(rows.map((r) => del.mutateAsync({ params: { id: r.id } })));
        await refresh();
      },
    },
  ];
}
