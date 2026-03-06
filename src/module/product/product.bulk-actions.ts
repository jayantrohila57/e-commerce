"use client";

import { Eye, EyeOff, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/core/api/api.client";
import type { BulkAction } from "@/shared/components/table/custom-action/bulk-operations.factory";
import type { ProductBase } from "./product.types";

export function useProductBulkActions(): BulkAction<ProductBase>[] {
  const utils = apiClient.useUtils();
  const router = useRouter();

  const update = apiClient.product.update.useMutation();
  const del = apiClient.product.delete.useMutation();

  const refresh = async () => {
    await utils.product.getMany.invalidate();
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
        `Delete ${rows.length} product${rows.length !== 1 ? "s" : ""}? This will soft-delete them.`,
      run: async (rows) => {
        await Promise.all(rows.map((r) => del.mutateAsync({ params: { id: r.id } })));
        await refresh();
      },
    },
    {
      id: "activate",
      label: "Make Active",
      icon: Eye,
      variant: "default",
      requiresConfirmation: true,
      disabledCondition: (rows) => rows.every((r) => r.isActive),
      confirmationMessage: (rows) => `Mark ${rows.length} product${rows.length !== 1 ? "s" : ""} as active?`,
      run: async (rows) => {
        await Promise.all(rows.map((r) => update.mutateAsync({ params: { id: r.id }, body: { isActive: true } })));
        await refresh();
      },
    },
    {
      id: "deactivate",
      label: "Make Inactive",
      icon: EyeOff,
      variant: "outline",
      requiresConfirmation: true,
      disabledCondition: (rows) => rows.every((r) => !r.isActive),
      confirmationMessage: (rows) => `Mark ${rows.length} product${rows.length !== 1 ? "s" : ""} as inactive?`,
      run: async (rows) => {
        await Promise.all(rows.map((r) => update.mutateAsync({ params: { id: r.id }, body: { isActive: false } })));
        await refresh();
      },
    },
  ];
}
