"use client";

import { Boxes, CreditCard, Heart, LocateIcon, Lock, ShoppingCart, UserCog, UserIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { PATH } from "@/shared/config/routes";

type NavItem<T extends Route = Route> = {
  href: T;
  label: string;
  icon: React.ReactNode;
  id: string;
};

const sections: NavItem<Route>[] = [
  {
    label: "Account",
    icon: <UserCog size={14} />,
    href: PATH.ACCOUNT.ROOT,
    id: "account",
  },
  { id: "cart", label: "Cart", href: PATH.ACCOUNT.CART, icon: <ShoppingCart size={14} /> },
  { id: "wishlist", label: "Wishlist", href: PATH.ACCOUNT.WISHLIST, icon: <Heart size={14} /> },
  { id: "order", label: "Order", href: PATH.ACCOUNT.ORDER, icon: <Boxes size={14} /> },
  { id: "payment", label: "Payment", href: PATH.ACCOUNT.PAYMENT, icon: <CreditCard size={14} /> },
  { id: "address", label: "Address", href: PATH.ACCOUNT.ADDRESS, icon: <LocateIcon size={14} /> },
  {
    id: "shipment",
    label: "Shipment",
    href: PATH.ACCOUNT.SHIPMENT,
    icon: <LocateIcon size={14} />,
  },
  { id: "review", label: "Review", href: PATH.ACCOUNT.REVIEW, icon: <LocateIcon size={14} /> },
];

export function AccountSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 h-full w-full border-r border-b">
      <ul className="space-y-2 h-full w-full">
        {sections.map((section) => {
          const isActive = pathname === section.href;
          return (
            <li key={section.id} className="w-full border-b p-4">
              <Link href={section.href}>
                <Button
                  variant={isActive ? "outline" : "ghost"}
                  className="flex w-full items-center justify-start rounded-sm text-left text-xs"
                >
                  {section.icon}
                  <span className="font-medium">{section.label}</span>
                </Button>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
