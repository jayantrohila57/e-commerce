"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";
import type { Order } from "@/module/order/order.schema";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { cn } from "@/shared/utils/lib/utils";

interface OrderCustomerCellProps {
  order: Order;
}

function toSlug(value: string | null | undefined): string {
  if (!value) return "customer";
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "customer"
  );
}

export function OrderCustomerCell({ order }: OrderCustomerCellProps) {
  const router = useRouter();

  const user = order.user;
  const userId = order.userId ?? user?.id ?? null;

  const name = (user?.name || order.shippingAddress.fullName || "Guest").trim();
  const email = user?.email ?? null;

  const isGuest = !userId;

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const handleClick = () => {
    if (!userId || isGuest) return;
    const slug = toSlug(name);
    const href = `/studio/users/${slug}?id=${encodeURIComponent(userId)}`;
    router.push(href as Route);
  };

  return (
    <div className="flex w-[260px] items-center gap-3">
      <Avatar size="sm" className="shrink-0">
        <AvatarFallback className={cn("text-xs font-medium")}>{initials || "C"}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 space-y-0.5">
        {isGuest ? (
          <div className="truncate text-xs font-medium text-muted-foreground">
            Guest{order.shippingAddress.fullName ? ` · ${order.shippingAddress.fullName}` : ""}
          </div>
        ) : (
          <button
            type="button"
            onClick={handleClick}
            className="max-w-full truncate text-left text-sm font-medium underline-offset-4 hover:underline"
          >
            {name}
          </button>
        )}
        <div className="max-w-full truncate text-xs text-muted-foreground">{email || "—"}</div>
      </div>
    </div>
  );
}
