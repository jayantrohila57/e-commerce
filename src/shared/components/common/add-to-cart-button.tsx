"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/module/cart/use-cart";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/lib/utils";

interface AddToCartButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variantId: string;
  showIcon?: boolean;
}

export function AddToCartButton({ variantId, showIcon = true, className, children, ...props }: AddToCartButtonProps) {
  const { cart, addToCart, isAdding } = useCart();

  const currentLine = cart?.items?.find((item) => item.variantId === variantId);
  const currentQuantity = currentLine?.quantity ?? 0;

  return (
    <Button
      onClick={() => addToCart(variantId)}
      disabled={isAdding || props.disabled}
      className={cn("w-full", className)}
      {...props}
    >
      {isAdding ? (
        "Adding..."
      ) : (
        <>
          <div className="relative flex items-center gap-2">
            {showIcon && <ShoppingCart className="h-4 w-4" />}
            <span>{children || "Add to Cart"}</span>
            {currentQuantity > 0 && (
              <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white shadow-sm">
                {currentQuantity > 99 ? "99+" : currentQuantity}
              </span>
            )}
          </div>
        </>
      )}
    </Button>
  );
}
