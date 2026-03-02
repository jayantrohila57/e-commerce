"use client";

import dynamic from "next/dynamic";

import { Skeleton } from "@/shared/components/ui/skeleton";
import { Button } from "../../ui/button";
import Link from "next/link";
import { PATH } from "@/shared/config/routes";
import { UserDropdown } from "../user/nav-user";
import { useSession } from "@/core/auth/auth.client";

const ModeToggle = dynamic(async () => await import("@/core/theme/theme.selector").then((mod) => mod.ModeToggle), {
  ssr: false,
  loading: () => <Skeleton className="h-9 w-9 rounded-md" />,
});

const CartButton = dynamic(
  async () => await import("@/shared/components/common/cart-button").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <Skeleton className="h-9 w-9 rounded-md" />,
  },
);

const WishListButton = dynamic(
  async () => await import("@/shared/components/common/wishlist-button").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <Skeleton className="h-9 w-9 rounded-md" />,
  },
);

export function HeaderActions() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="flex flex-row gap-1 sm:gap-2 md:gap-4">
        <CartButton />
        <WishListButton />
        <ModeToggle />
        <Link href={PATH.AUTH.SIGN_UP}>
          <Button size={"sm"} variant="outline">
            Sign Up
          </Button>
        </Link>
      </div>
    );
  }
  if (session) {
    return (
      <div className="flex flex-row gap-1 sm:gap-2 md:gap-4">
        <CartButton />
        <WishListButton />
        <ModeToggle />
        {session?.user && <UserDropdown user={session?.user} />}
      </div>
    );
  }
}
