"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/module/wishlist/use-wishlist";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/lib/utils";

interface PDPWishlistToggleProps {
  variantId: string;
}

export function PDPWishlistToggle({ variantId }: PDPWishlistToggleProps) {
  const { wishlist, addToWishlist, removeFromWishlist, isAdding, isRemoving } = useWishlist();

  const existing = wishlist.find((item) => item.variantId === variantId);
  const isInWishlist = !!existing;
  const isBusy = isAdding || isRemoving;

  const handleToggle = () => {
    if (isBusy) return;

    if (isInWishlist && existing) {
      removeFromWishlist(existing.id);
    } else {
      addToWishlist(variantId);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={isInWishlist}
      className={cn(
        "h-9 w-9 rounded-full bg-background/80 backdrop-blur border-border hover:border-primary/60 transition-colors",
        isInWishlist && "border-red-500/60",
      )}
      onClick={handleToggle}
      disabled={isBusy}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-colors",
          isInWishlist ? "fill-red-500 text-red-500" : "text-muted-foreground",
        )}
      />
    </Button>
  );
}
