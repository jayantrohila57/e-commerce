"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useWishlist } from "@/module/wishlist/use-wishlist";
import { Button } from "@/shared/components/ui/button";
import { PATH } from "@/shared/config/routes";
import { WishlistItem } from "./wishlist-item";

export function WishlistItemList() {
  const { wishlist, isLoading } = useWishlist();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-muted p-4 rounded-full mb-4">
          <Heart className="h-8 w-8 text-muted-foreground animate-pulse" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Loading your wishlist</h2>
        <p className="text-muted-foreground mb-6 max-w-xs">Please wait while we fetch your saved items.</p>
      </div>
    );
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-muted p-4 rounded-full mb-4">
          <Heart className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
        <p className="text-muted-foreground mb-6 max-w-xs">
          Start saving your favorite products to quickly find them later.
        </p>
        <Link href={PATH.STORE.ROOT}>
          <Button>Browse products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {wishlist.map((item) => (
        <WishlistItem key={item.id} item={item} />
      ))}
    </div>
  );
}

