"use client";

import { toast } from "sonner";
import { apiClient } from "@/core/api/api.client";
import { STATUS } from "@/shared/config/api.config";
import { handleTrpcAuthClientError } from "@/shared/utils/handle-trpc-auth-error";
import type { Order } from "./order.schema";

export function useOrder() {
  const utils = apiClient.useUtils();

  const ordersQuery = apiClient.order.getMany.useQuery(undefined, {
    staleTime: 30_000,
  });

  const invalidateOrders = () => {
    void utils.order.getMany.invalidate();
  };

  const updateStatusMutation = apiClient.order.updateStatus.useMutation({
    onSuccess: (res) => {
      if (res.status === STATUS.SUCCESS) {
        toast.success(res.message || "Order status updated");
        invalidateOrders();
      } else {
        toast.error(res.message || "Failed to update order status");
      }
    },
    onError: (err) => {
      if (handleTrpcAuthClientError(err, "Could not update the order. Please sign in again.")) return;
      toast.error("Error updating order status");
    },
  });

  return {
    orders: (ordersQuery.data?.data as Order[]) ?? [],
    isLoading: ordersQuery.isLoading,
    refetch: ordersQuery.refetch,
    updateStatus: (id: string, status: Order["status"], notes?: string) =>
      updateStatusMutation.mutate({
        params: { id },
        body: { status, notes },
      }),
    isUpdatingStatus: updateStatusMutation.isPending,
  };
}
