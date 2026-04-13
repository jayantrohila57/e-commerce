import { AccountSidebar } from "@/module/account/account-sidebar";
import { cn } from "@/shared/utils/lib/utils";

export default function AccountPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "flex w-full flex-1 flex-col border-t border-border bg-background",
        "md:grid md:min-h-[calc(100dvh-8rem)] md:grid-cols-[minmax(12rem,15rem)_1fr]",
      )}
    >
      <aside
        className={cn("shrink-0 border-border bg-muted/25 md:bg-background", "border-b md:border-r md:border-b-0")}
      >
        <AccountSidebar />
      </aside>
      <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">{children}</div>
    </div>
  );
}
