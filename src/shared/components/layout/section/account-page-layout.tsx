import { AccountSidebar } from "@/module/account/account-sidebar";

export default function AccountPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-full pt-16 border-t  min-h-[calc(100vh-2rem)] w-full grid-cols-12 shadow-none">
      <div className="col-span-2 h-full border w-full">
        <AccountSidebar />
      </div>
      <div className="col-span-10 h-full border-b border-r w-full">{children}</div>
    </div>
  );
}
