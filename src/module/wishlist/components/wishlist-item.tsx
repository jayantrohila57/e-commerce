"use client";

import { Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import type { Wishlist } from "@/module/wishlist/wishlist.schema";
import { useWishlist } from "@/module/wishlist/use-wishlist";
import { Button } from "@/shared/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";

interface WishlistItemProps {
  item: Wishlist;
}

export function WishlistItem({ item }: WishlistItemProps) {
  const { removeFromWishlist, isRemoving } = useWishlist();

  const handleRemove = () => {
    if (!isRemoving) {
      removeFromWishlist(item.id);
    }
  };

  const image = item.variant?.product.baseImage;

  return (
    <div className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0 border-b last:border-0 border-border">
      <div className="flex items-center gap-4">
        {image ? (
          <div className="relative h-20 w-20 overflow-hidden rounded-md border border-border">
            <Image src={image} alt={item.variant?.product.title ?? "Product"} fill className="object-cover" />
          </div>
        ) : (
          <div className="h-20 w-20 flex items-center justify-center rounded-md border border-border bg-muted text-muted-foreground text-xs text-center p-2">
            No Image
          </div>
        )}
        <div className="flex flex-col">
          <h3 className="font-medium text-sm sm:text-base">{item.variant?.product.title}</h3>
          <p className="text-xs text-muted-foreground">{item.variant?.title}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 min-w-[80px] justify-end">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleRemove}
              disabled={isRemoving}
            >
              {isRemoving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Remove from wishlist</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

