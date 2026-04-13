"use client";

import { ShoppingBag } from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useSession } from "@/core/auth/auth.client";
import { useCart } from "@/module/cart/use-cart";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { PATH } from "@/shared/config/routes";
import { signInUrlWithCallback } from "@/shared/utils/auth-callback";

export default function CartButton() {
  const router = useRouter();
  const { data: session } = useSession();
  const { cart } = useCart();
  const count = cart?.itemCount ?? 0;
  const isSignedIn = Boolean(session?.user?.id);

  const handleClick = () => {
    if (!isSignedIn) {
      router.push(signInUrlWithCallback(PATH.ACCOUNT.CART) as Route);
      return;
    }
    router.push(PATH.ACCOUNT.CART);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative group  transition-colors"
            onClick={handleClick}
            aria-label="Cart"
          >
            <ShoppingBag size={18} className="group-hover:text-primary transition-colors" aria-hidden="true" />
            {count > 0 && (
              <Badge className="absolute -top-2 left-full min-w-[20px] h-5 -translate-x-1/2 px-1 flex items-center justify-center text-[10px] bg-primary text-primary-foreground border-2 border-background animate-in zoom-in-50 duration-200">
                {count > 99 ? "99+" : count}
              </Badge>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent sideOffset={10}>
          <p id="cart-tooltip">
            {!isSignedIn
              ? "Sign in to open your saved cart"
              : count > 0
                ? `You have ${count} item${count === 1 ? "" : "s"} in your cart`
                : "Your cart is empty"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
