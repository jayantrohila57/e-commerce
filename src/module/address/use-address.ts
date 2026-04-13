"use client";

import { toast } from "sonner";
import { apiClient } from "@/core/api/api.client";
import { useSession } from "@/core/auth/auth.client";
import { STATUS } from "@/shared/config/api.config";
import { handleTrpcAuthClientError } from "@/shared/utils/handle-trpc-auth-error";
import type { AddressInsert, AddressUpdate } from "./address.schema";

export function useAddress() {
  const { data: session } = useSession();
  const utils = apiClient.useUtils();
  const isAuthenticated = Boolean(session?.user?.id);

  const addressQuery = apiClient.address.getMany.useQuery(undefined, {
    enabled: isAuthenticated,
    staleTime: 30_000,
  });

  const createMutation = apiClient.address.create.useMutation({
    onSuccess: (res) => {
      if (res.status === STATUS.SUCCESS) {
        toast.success(res.message || "Address created successfully.");
        utils.address.getMany.invalidate();
      } else {
        toast.error(res.message || "Failed to create address.");
      }
    },
    onError: (err) => {
      if (handleTrpcAuthClientError(err, "Could not save the address. Please sign in again.")) return;
      toast.error("Error creating address.");
    },
  });

  const updateMutation = apiClient.address.update.useMutation({
    onSuccess: (res) => {
      if (res.status === STATUS.SUCCESS) {
        toast.success(res.message || "Address updated successfully.");
        utils.address.getMany.invalidate();
      } else {
        toast.error(res.message || "Failed to update address.");
      }
    },
    onError: (err) => {
      if (handleTrpcAuthClientError(err, "Could not update the address. Please sign in again.")) return;
      toast.error("Error updating address.");
    },
  });

  const deleteMutation = apiClient.address.delete.useMutation({
    onSuccess: (res) => {
      if (res.status === STATUS.SUCCESS) {
        toast.success(res.message || "Address deleted successfully.");
        utils.address.getMany.invalidate();
      } else {
        toast.error(res.message || "Failed to delete address.");
      }
    },
    onError: (err) => {
      if (handleTrpcAuthClientError(err, "Could not delete the address. Please sign in again.")) return;
      toast.error("Error deleting address.");
    },
  });

  const setDefaultMutation = apiClient.address.setDefault.useMutation({
    onSuccess: (res) => {
      if (res.status === STATUS.SUCCESS) {
        toast.success(res.message || "Default address updated.");
        utils.address.getMany.invalidate();
      } else {
        toast.error(res.message || "Failed to set default address.");
      }
    },
    onError: (err) => {
      if (handleTrpcAuthClientError(err, "Could not update the default address. Please sign in again.")) return;
      toast.error("Error setting default address.");
    },
  });

  return {
    addresses: addressQuery.data?.data ?? [],
    isLoading: isAuthenticated && addressQuery.isLoading,
    createAddress: (body: AddressInsert) => createMutation.mutate({ body }),
    updateAddress: (id: string, body: AddressUpdate) =>
      updateMutation.mutate({
        params: { id },
        body,
      }),
    deleteAddress: (id: string) => deleteMutation.mutate({ params: { id } }),
    setDefaultAddress: (id: string) => setDefaultMutation.mutate({ params: { id } }),
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isSettingDefault: setDefaultMutation.isPending,
  };
}
