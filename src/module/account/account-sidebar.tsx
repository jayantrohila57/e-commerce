"use client";

import { Lock, UserIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { PATH } from "@/shared/config/routes";

type NavItem<T extends string = string> = {
  href: T;
  label: string;
  icon: React.ReactNode;
  id: string;
};

const sections: NavItem<Route>[] = [
  {
    label: "Account",
    icon: <UserIcon size={14} />,
    href: PATH.ACCOUNT.USER,
    id: "account",
  },
  { id: "profile", label: "Profile", href: PATH.ACCOUNT.PROFILE, icon: <UserIcon size={14} /> },
  { id: "security", label: "Security", href: PATH.ACCOUNT.SECURITY, icon: <Lock size={14} /> },
  { id: "sessions", label: "Sessions", href: PATH.ACCOUNT.SESSIONS, icon: <Lock size={14} /> },
];

export function AccountSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex-1">
      <ul className="space-y-2">
        {sections.map((section) => {
          const isActive = pathname === section.href;
          return (
            <li key={section.id}>
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
