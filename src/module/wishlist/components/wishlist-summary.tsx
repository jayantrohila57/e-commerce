"use client";

import { Loader2 } from "lucide-react";
import { useWishlist } from "@/module/wishlist/use-wishlist";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";

export function WishlistSummary() {
  const { wishlist, isLoading, clearWishlist, isClearing } = useWishlist();

  if (isLoading || !wishlist || wishlist.length === 0) return null;

  const itemCount = wishlist.length;

  return (
    <div className="bg-muted/30 rounded-lg p-6 border border-border space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Wishlist Summary</h2>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-destructive"
              onClick={() => {
                if (!isClearing) clearWishlist();
              }}
              disabled={isClearing}
            >
              {isClearing ? (
                <>
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  Clearing…
                </>
              ) : (
                "Clear wishlist"
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Remove all items from your wishlist</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total items</span>
          <span>{itemCount}</span>
        </div>

        <Separator className="my-2" />

        <p className="text-xs text-muted-foreground">
          Items in your wishlist are not reserved and may go out of stock. Move them to your cart to secure them.
        </p>
      </div>
    </div>
  );
}
