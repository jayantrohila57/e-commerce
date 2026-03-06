"use client";

import { Loader2, Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem as CartItemType } from "@/module/cart/cart.schema";
import { useCart } from "@/module/cart/use-cart";
import { Button } from "@/shared/components/ui/button";
import { BlurImage } from "@/shared/components/ui/image";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { getImageSrc } from "@/shared/utils/lib/image.utils";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart, isUpdating, isRemoving } = useCart();

  const handleIncrement = () => {
    if (!isUpdating && !isRemoving) {
      updateQuantity(item.lineId, item.quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (item.quantity > 1 && !isUpdating && !isRemoving) {
      updateQuantity(item.lineId, item.quantity - 1);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0 border-b last:border-0 border-border">
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-border">
          <BlurImage src={getImageSrc(item.image)} alt={item.productTitle ?? "Product"} fill className="object-cover" />
        </div>
        <div className="flex flex-col">
          <h3 className="font-medium text-sm sm:text-base">{item.productTitle}</h3>
          <p className="text-xs text-muted-foreground">{item.variantTitle}</p>
          <div className="mt-1 flex gap-1">
            {item.attributes?.map((attr) => (
              <span
                key={attr.title}
                className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground capitalize"
              >
                {attr.title}: {attr.value}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={handleDecrement}
                disabled={item.quantity <= 1 || isUpdating || isRemoving}
              >
                {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Minus className="h-3 w-3" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Decrease quantity</p>
            </TooltipContent>
          </Tooltip>
          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={handleIncrement}
                disabled={isUpdating || isRemoving}
              >
                {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Increase quantity</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex items-center gap-4 min-w-[80px] justify-end">
          <span className="text-sm font-semibold">₹{item.totalPrice.toLocaleString()}</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => {
                  if (!isRemoving && !isUpdating) {
                    removeFromCart(item.lineId);
                  }
                }}
                disabled={isRemoving || isUpdating}
              >
                {isRemoving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Remove from cart</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
