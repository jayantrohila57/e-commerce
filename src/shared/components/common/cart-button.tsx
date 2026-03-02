"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { PATH } from "@/shared/config/routes";
import { useRouter } from "next/navigation";

export default function CartButton() {
  const router = useRouter();
  const [count, setCount] = useState(3);

  const handleClick = () => {
    router.push(PATH.ACCOUNT.CART);
    setCount(0);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" className="relative" onClick={handleClick} aria-label="Cart">
            <ShoppingBag size={16} aria-hidden="true" />
            {count > 0 && (
              <Badge className="absolute -top-2 left-full min-w-5 -translate-x-1/2 px-1">
                {count > 99 ? "99+" : count}
              </Badge>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p id="cart-tooltip">{"You have " + count + " items in your cart"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
