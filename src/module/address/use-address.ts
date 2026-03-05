"use client";

import { toast } from "sonner";
import { apiClient } from "@/core/api/api.client";
import { STATUS } from "@/shared/config/api.config";
import type { AddressInsert, AddressUpdate } from "./address.schema";

export function useAddress() {
  const utils = apiClient.useUtils();

  const addressQuery = apiClient.address.getMany.useQuery(undefined, {
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
    onError: () => {
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
    onError: () => {
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
    onError: () => {
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
    onError: () => {
      toast.error("Error setting default address.");
    },
  });

  return {
    addresses: addressQuery.data?.data ?? [],
    isLoading: addressQuery.isLoading,
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
