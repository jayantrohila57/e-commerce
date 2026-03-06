"use client";

import { Truck, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/core/api/api.client";
import type { BulkAction } from "@/shared/components/table/custom-action/bulk-operations.factory";
import type { Order } from "./order.schema";

export function useOrderBulkActions(): BulkAction<Order>[] {
  const utils = apiClient.useUtils();
  const router = useRouter();

  const updateStatus = apiClient.order.updateStatus.useMutation();

  const refresh = async () => {
    await utils.order.getManyAdmin.invalidate();
    router.refresh();
  };

  return [
    {
      id: "mark_shipped",
      label: "Mark as Shipped",
      icon: Truck,
      variant: "default",
      requiresConfirmation: true,
      disabledCondition: (rows) => rows.every((r) => r.status === "shipped" || r.status === "delivered"),
      confirmationMessage: (rows) => `Mark ${rows.length} order${rows.length !== 1 ? "s" : ""} as shipped?`,
      run: async (rows) => {
        await Promise.all(
          rows.map((r) =>
            updateStatus.mutateAsync({
              params: { id: r.id },
              body: { status: "shipped" },
            }),
          ),
        );
        await refresh();
      },
    },
    {
      id: "cancel",
      label: "Cancel Orders",
      icon: XCircle,
      variant: "destructive",
      requiresConfirmation: true,
      disabledCondition: (rows) => rows.every((r) => r.status === "cancelled"),
      confirmationMessage: (rows) =>
        `Cancel ${rows.length} order${rows.length !== 1 ? "s" : ""}? This cannot be undone.`,
      run: async (rows) => {
        await Promise.all(
          rows.map((r) =>
            updateStatus.mutateAsync({
              params: { id: r.id },
              body: { status: "cancelled" },
            }),
          ),
        );
        await refresh();
      },
    },
  ];
}
