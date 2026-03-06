"use client";

import { toast } from "sonner";
import { apiClient } from "@/core/api/api.client";
import type { ShipmentCreateInput, ShipmentUpdateStatusInput } from "@/module/shipment/shipment.schema";
import { STATUS } from "@/shared/config/api.config";

export function useShipment(orderId?: string | null) {
  const utils = apiClient.useUtils();

  const getByOrderQuery = apiClient.shipment.getByOrder.useQuery(
    { params: { orderId: orderId ?? "" } },
    { enabled: !!orderId?.trim() },
  );

  const createMutation = apiClient.shipment.create.useMutation({
    onSuccess: (res) => {
      if (res.status === STATUS.SUCCESS) {
        toast.success(res.message ?? "Shipment created successfully.");
        utils.shipment.getByOrder.invalidate();
        utils.shipment.getMany.invalidate();
      } else {
        toast.error(res.message ?? "Failed to create shipment.");
      }
    },
    onError: () => {
      toast.error("Error creating shipment.");
    },
  });

  const updateStatusMutation = apiClient.shipment.updateStatus.useMutation({
    onSuccess: (res) => {
      if (res.status === STATUS.SUCCESS) {
        toast.success(res.message ?? "Shipment status updated.");
        utils.shipment.getByOrder.invalidate();
        utils.shipment.getMany.invalidate();
        utils.order.get.invalidate();
      } else {
        toast.error(res.message ?? "Failed to update shipment status.");
      }
    },
    onError: () => {
      toast.error("Error updating shipment status.");
    },
  });

  return {
    shipments: getByOrderQuery.data?.data ?? [],
    isLoading: getByOrderQuery.isLoading,
    refetch: getByOrderQuery.refetch,
    createShipment: (body: ShipmentCreateInput) => createMutation.mutateAsync({ body }),
    updateStatus: (id: string, body: ShipmentUpdateStatusInput) =>
      updateStatusMutation.mutateAsync({
        params: { id },
        body,
      }),
    isCreating: createMutation.isPending,
    isUpdatingStatus: updateStatusMutation.isPending,
  };
}
