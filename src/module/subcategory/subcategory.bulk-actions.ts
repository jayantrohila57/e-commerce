"use client";

import { Archive, Eye, EyeOff, Star, StarOff, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/core/api/api.client";
import type { BulkAction } from "@/shared/components/table/custom-action/bulk-operations.factory";
import type { SubcategoryBase } from "./subcategory.schema";

export function useSubcategoryBulkActions(): BulkAction<SubcategoryBase>[] {
  const utils = apiClient.useUtils();
  const router = useRouter();

  const update = apiClient.subcategory.update.useMutation();
  const del = apiClient.subcategory.delete.useMutation();

  const refresh = async () => {
    await utils.subcategory.getMany.invalidate();
    router.refresh();
  };

  return [
    {
      id: "delete",
      label: "Delete",
      icon: Trash2,
      variant: "destructive",
      requiresConfirmation: true,
      confirmationMessage: (rows) => `Delete ${rows.length} subcategor${rows.length !== 1 ? "ies" : "y"}?`,
      run: async (rows) => {
        await Promise.all(rows.map((r) => del.mutateAsync({ params: { id: r.id } })));
        await refresh();
      },
    },
    {
      id: "make_public",
      label: "Make Public",
      icon: Eye,
      variant: "outline",
      requiresConfirmation: true,
      disabledCondition: (rows) => rows.some((r) => r.visibility === "public"),
      confirmationMessage: (rows) => `Make ${rows.length} subcategor${rows.length !== 1 ? "ies" : "y"} public?`,
      run: async (rows) => {
        await Promise.all(
          rows.map((r) => update.mutateAsync({ params: { id: r.id }, body: { visibility: "public" } })),
        );
        await refresh();
      },
    },
    {
      id: "make_private",
      label: "Make Private",
      icon: EyeOff,
      variant: "outline",
      requiresConfirmation: true,
      disabledCondition: (rows) => rows.some((r) => r.visibility === "private"),
      confirmationMessage: (rows) => `Make ${rows.length} subcategor${rows.length !== 1 ? "ies" : "y"} private?`,
      run: async (rows) => {
        await Promise.all(
          rows.map((r) => update.mutateAsync({ params: { id: r.id }, body: { visibility: "private" } })),
        );
        await refresh();
      },
    },
    {
      id: "make_hidden",
      label: "Make Hidden",
      icon: Archive,
      variant: "outline",
      requiresConfirmation: true,
      disabledCondition: (rows) => rows.some((r) => r.visibility === "hidden"),
      confirmationMessage: (rows) => `Hide ${rows.length} subcategor${rows.length !== 1 ? "ies" : "y"}?`,
      run: async (rows) => {
        await Promise.all(
          rows.map((r) => update.mutateAsync({ params: { id: r.id }, body: { visibility: "hidden" } })),
        );
        await refresh();
      },
    },
    {
      id: "feature",
      label: "Mark Featured",
      icon: Star,
      variant: "secondary",
      requiresConfirmation: true,
      disabledCondition: (rows) => rows.some((r) => r.isFeatured === true),
      confirmationMessage: (rows) => `Mark ${rows.length} subcategor${rows.length !== 1 ? "ies" : "y"} as featured?`,
      run: async (rows) => {
        await Promise.all(rows.map((r) => update.mutateAsync({ params: { id: r.id }, body: { isFeatured: true } })));
        await refresh();
      },
    },
    {
      id: "unfeature",
      label: "Unmark Featured",
      icon: StarOff,
      variant: "secondary",
      requiresConfirmation: true,
      disabledCondition: (rows) => rows.some((r) => r.isFeatured === false),
      confirmationMessage: (rows) => `Unmark featured for ${rows.length} subcategor${rows.length !== 1 ? "ies" : "y"}?`,
      run: async (rows) => {
        await Promise.all(rows.map((r) => update.mutateAsync({ params: { id: r.id }, body: { isFeatured: false } })));
        await refresh();
      },
    },
  ];
}
