"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/core/api/api.client";
import type { BulkAction } from "@/shared/components/table/custom-action/bulk-operations.factory";
import type { InventoryBase } from "./inventory.types";

export function useInventoryBulkActions(): BulkAction<InventoryBase>[] {
  const utils = apiClient.useUtils();
  const router = useRouter();

  const del = apiClient.inventory.delete.useMutation();

  const refresh = async () => {
    await utils.inventory.getMany.invalidate();
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
        `Delete ${rows.length} inventory item${rows.length !== 1 ? "s" : ""}? This cannot be undone.`,
      run: async (rows) => {
        await Promise.all(rows.map((r) => del.mutateAsync({ params: { id: r.id } })));
        await refresh();
      },
    },
  ];
}
