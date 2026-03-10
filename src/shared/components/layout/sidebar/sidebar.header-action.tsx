"use client";

import dynamic from "next/dynamic";
import { useSession } from "@/core/auth/auth.client";
import { Skeleton } from "@/shared/components/ui/skeleton";

const UserDropdown = dynamic(async () => await import("../user/nav-user").then((mod) => mod.UserDropdown), {
  ssr: false,
  loading: () => <Skeleton className="h-9 w-9 rounded-md" />,
});

const ModeToggle = dynamic(async () => await import("@/core/theme/theme.selector").then((mod) => mod.ModeToggle), {
  ssr: false,
  loading: () => <Skeleton className="h-9 w-9 rounded-md" />,
});

const SignOutIcon = dynamic(
  async () => await import("@/module/auth/auth.sign-out-icon").then((mod) => mod.SignOutIcon),
  {
    ssr: false,
    loading: () => <Skeleton className="h-9 w-9 rounded-md" />,
  },
);

export function SidebarHeaderActions() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex flex-row">
        <div className="h-16 w-16 border-x flex items-center justify-center">
          <ModeToggle />
        </div>
        <div className="h-16 w-16 border-r flex items-center justify-center">
          <UserDropdown user={session?.user} />
        </div>
      </div>
    );
  }
}
