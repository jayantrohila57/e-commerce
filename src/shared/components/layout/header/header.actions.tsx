"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "@/core/auth/auth.client";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { PATH } from "@/shared/config/routes";
import { Button } from "../../ui/button";
import { UserDropdown } from "../user/nav-user";

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

/** Placeholder for auth slot so server and client render the same structure and avoid hydration mismatch. */
function AuthSlotSkeleton() {
  return <Skeleton className="h-9 w-9 rounded-md" />;
}

export function HeaderActions() {
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  const authSlot = !mounted ? (
    <AuthSlotSkeleton />
  ) : session?.user ? (
    <UserDropdown user={session.user} />
  ) : (
    <Link href={PATH.AUTH.SIGN_UP}>
      <Button size="sm" variant="ghost">
        Sign Up
      </Button>
    </Link>
  );

  return (
    <div className="flex flex-row h-full">
      <div className="h-full flex flex-row items-center p-2 px-4 border-l">
        <CartButton />
      </div>
      <div className="h-full flex flex-row items-center p-2 px-4 border-l">
        <WishListButton />
      </div>
      <div className="h-full flex flex-row items-center p-2 px-4 border-l">
        <ModeToggle />
      </div>
      <div className="h-full flex flex-row items-center p-2 px-4 border-l">{authSlot}</div>
    </div>
  );
}
