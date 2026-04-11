"use client";

import { toast } from "sonner";
import { apiClient } from "@/core/api/api.client";
import { useSession } from "@/core/auth/auth.client";
import { getOrGenerateSessionId } from "@/shared/utils/lib/sessionId";

export function useCart() {
  const { data: session } = useSession();
  const utils = apiClient.useUtils();
  const sessionId = typeof window !== "undefined" ? getOrGenerateSessionId() : undefined;

  const cartQuery = apiClient.cart.get.useQuery(
    {},
    {
      enabled: !!(session?.user?.id || sessionId),
    },
  );

  const addMutation = apiClient.cart.add.useMutation({
    onMutate: async (newInfo) => {
      await utils.cart.get.cancel();
      const previousCart = utils.cart.get.getData();
      return { previousCart };
    },
    onSuccess: (res) => {
      if (res.status === "success") {
        toast.success("Added to cart");
        utils.cart.get.invalidate();
        utils.cart.getTotals.invalidate();
      } else {
        toast.error(res.message || "Failed to add to cart");
      }
    },
    onError: (err, newInfo, context) => {
      utils.cart.get.setData({}, context?.previousCart);
      toast.error("Error adding to cart");
    },
  });

  const updateMutation = apiClient.cart.update.useMutation({
    onError: () => {
      toast.error("Error updating cart item");
    },
    onSuccess: (res) => {
      if (res.status === "success") {
        utils.cart.get.invalidate();
        utils.cart.getTotals.invalidate();
      }
    },
  });

  const removeMutation = apiClient.cart.remove.useMutation({
    onError: () => {
      toast.error("Error removing item from cart");
    },
    onSuccess: (res) => {
      if (res.status === "success") {
        toast.success("Removed from cart");
        utils.cart.get.invalidate();
        utils.cart.getTotals.invalidate();
      }
    },
  });

  const clearMutation = apiClient.cart.clear.useMutation({
    onError: () => {
      toast.error("Error clearing cart");
    },
    onSuccess: (res) => {
      if (res.status === "success") {
        toast.success("Cart cleared");
        utils.cart.get.invalidate();
        utils.cart.getTotals.invalidate();
      }
    },
  });

  return {
    cart: cartQuery.data?.data,
    isLoading: cartQuery.isLoading,
    addToCart: (variantId: string, quantity: number = 1) =>
      addMutation.mutate({ body: { variantId, quantity, sessionId: session?.user?.id ? undefined : sessionId } }),
    updateQuantity: (lineId: string, quantity: number) =>
      updateMutation.mutate({ params: { lineId }, body: { quantity } }),
    removeFromCart: (lineId: string) => removeMutation.mutate({ params: { lineId } }),
    clearCart: () => clearMutation.mutate({ body: { sessionId: session?.user?.id ? undefined : sessionId } }),
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isRemoving: removeMutation.isPending,
    isClearing: clearMutation.isPending,
  };
}
