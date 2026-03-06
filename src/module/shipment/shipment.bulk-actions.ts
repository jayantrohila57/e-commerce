"use client";

import { Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/core/api/api.client";
import type { BulkAction } from "@/shared/components/table/custom-action/bulk-operations.factory";
import type { Shipment } from "./shipment.schema";

export function useShipmentBulkActions(): BulkAction<Shipment>[] {
  const utils = apiClient.useUtils();
  const router = useRouter();

  const updateStatus = apiClient.shipment.updateStatus.useMutation();

  const refresh = async () => {
    await utils.shipment.getMany.invalidate();
    router.refresh();
  };

  return [
    {
      id: "mark_in_transit",
      label: "Mark In Transit",
      icon: Truck,
      variant: "default",
      requiresConfirmation: true,
      disabledCondition: (rows) => rows.every((r) => r.status === "in_transit" || r.status === "delivered"),
      confirmationMessage: (rows) => `Mark ${rows.length} shipment${rows.length !== 1 ? "s" : ""} as in transit?`,
      run: async (rows) => {
        await Promise.all(
          rows.map((r) =>
            updateStatus.mutateAsync({
              params: { id: r.id },
              body: { status: "in_transit" },
            }),
          ),
        );
        await refresh();
      },
    },
  ];
}
