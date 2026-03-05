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

  const clearMutation = apiClient.wishlist.clear.useMutation({
    onSuccess: (res) => {
      if (res.status === "success") {
        toast.success("Wishlist cleared");
        utils.wishlist.get.invalidate();
      } else {
        toast.error(res.message || "Failed to clear wishlist");
      }
    },
    onError: () => {
      toast.error("Error clearing wishlist");
    },
  });

  const moveToCartMutation = apiClient.wishlist.moveToCart.useMutation({
    onSuccess: (res) => {
      if (res.status === "success") {
        toast.success("Moved to cart");
        utils.wishlist.get.invalidate();
        utils.cart.get.invalidate();
        utils.cart.getTotals.invalidate();
      } else {
        toast.error(res.message || "Failed to move item to cart");
      }
    },
    onError: () => {
      toast.error("Error moving item to cart");
    },
  });

  return {
    wishlist: wishlistQuery.data?.data ?? [],
    isLoading: wishlistQuery.isLoading,
    addToWishlist: (variantId: string) => addMutation.mutate({ body: { variantId } }),
    removeFromWishlist: (id: string) => removeMutation.mutate({ params: { id } }),
    clearWishlist: () => clearMutation.mutate({}),
    moveToCart: (id: string) => moveToCartMutation.mutate({ params: { id } }),
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
    isClearing: clearMutation.isPending,
    isMoving: moveToCartMutation.isPending,
  };
}
