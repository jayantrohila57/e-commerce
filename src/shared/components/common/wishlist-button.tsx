"use client";

import { Heart } from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/module/wishlist/use-wishlist";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { PATH } from "@/shared/config/routes";
import { signInUrlWithCallback } from "@/shared/utils/auth-callback";

export default function WishListButton() {
  const router = useRouter();
  const { wishlist, isLoading, isAuthenticated } = useWishlist();
  const count = wishlist.length;

  const handleClick = () => {
    if (!isAuthenticated) {
      router.push(signInUrlWithCallback(PATH.ACCOUNT.WISHLIST) as Route);
      return;
    }
    router.push(PATH.ACCOUNT.WISHLIST);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative group   transition-colors"
            onClick={handleClick}
            aria-label="Wishlist"
            disabled={isLoading}
          >
            <Heart size={16} className="group-hover:text-primary transition-colors" aria-hidden="true" />
            {count > 0 && (
              <Badge className="absolute -top-2 left-full min-w-[20px] h-5 -translate-x-1/2 px-1 flex items-center justify-center text-[10px] bg-primary text-primary-foreground border-2 border-background animate-in zoom-in-50 duration-200">
                {count > 99 ? "99+" : count}
              </Badge>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent sideOffset={10}>
          <p id="wishlist-tooltip">
            {!isAuthenticated
              ? "Sign in to use your wishlist"
              : count > 0
                ? `You have ${count} item${count === 1 ? "" : "s"} in your wishlist`
                : "Your wishlist is empty"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
