"use client";

import { toast } from "sonner";
import { apiClient } from "@/core/api/api.client";
import { useSession } from "@/core/auth/auth.client";
import { handleTrpcAuthClientError } from "@/shared/utils/handle-trpc-auth-error";

export function useWishlist() {
  const { data: session } = useSession();
  const utils = apiClient.useUtils();
  const isAuthenticated = Boolean(session?.user?.id);

  const wishlistQuery = apiClient.wishlist.get.useQuery(undefined, {
    enabled: isAuthenticated,
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
    onError: (err) => {
      if (handleTrpcAuthClientError(err, "Could not update your wishlist. Please sign in again.")) return;
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
    onError: (err) => {
      if (handleTrpcAuthClientError(err, "Could not update your wishlist. Please sign in again.")) return;
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
    onError: (err) => {
      if (handleTrpcAuthClientError(err, "Could not clear your wishlist. Please sign in again.")) return;
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
    onError: (err) => {
      if (handleTrpcAuthClientError(err, "Could not move the item to your cart. Please sign in again.")) return;
      toast.error("Error moving item to cart");
    },
  });

  function addToWishlist(variantId: string) {
    if (!isAuthenticated) return;
    addMutation.mutate({ body: { variantId } });
  }

  function removeFromWishlist(id: string) {
    if (!isAuthenticated) return;
    removeMutation.mutate({ params: { id } });
  }

  function clearWishlist() {
    if (!isAuthenticated) return;
    clearMutation.mutate({});
  }

  function moveToCart(id: string) {
    if (!isAuthenticated) return;
    moveToCartMutation.mutate({ params: { id } });
  }

  return {
    wishlist: wishlistQuery.data?.data ?? [],
    isLoading: isAuthenticated && wishlistQuery.isLoading,
    isAuthenticated,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    moveToCart,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
    isClearing: clearMutation.isPending,
    isMoving: moveToCartMutation.isPending,
  };
}
