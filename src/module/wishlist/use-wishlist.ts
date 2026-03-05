"use client";

import { toast } from "sonner";
import { apiClient } from "@/core/api/api.client";

export function useWishlist() {
  const utils = apiClient.useUtils();

  const wishlistQuery = apiClient.wishlist.get.useQuery(undefined, {
    staleTime: 30_000,
  });

  const addMutation = apiClient.wishlist.add.useMutation({
    onSuccess: (res) => {
      if (res.status === "success") {
        toast.success("Added to wishlist");
        utils.wishlist.get.invalidate();
      } else {
        toast.error(res.message || "Failed to add to wishlist");
      }
    },
    onError: () => {
      toast.error("Error adding to wishlist");
    },
  });

  const removeMutation = apiClient.wishlist.remove.useMutation({
    onSuccess: (res) => {
      if (res.status === "success") {
        toast.success("Removed from wishlist");
        utils.wishlist.get.invalidate();
      } else {
        toast.error(res.message || "Failed to remove from wishlist");
      }
    },
    onError: () => {
      toast.error("Error removing from wishlist");
    },
  });

  return {
    wishlist: wishlistQuery.data?.data ?? [],
    isLoading: wishlistQuery.isLoading,
    addToWishlist: (variantId: string) => addMutation.mutate({ body: { variantId } }),
    removeFromWishlist: (id: string) => removeMutation.mutate({ params: { id } }),
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
  };
}

