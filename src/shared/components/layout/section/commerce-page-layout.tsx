import { CommerceSidebar } from "@/module/account/account.commerce.sidebar";

export default function CommercePageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-full min-h-[calc(100vh-8rem)] w-full grid-cols-12 shadow-none">
      <div className="col-span-2 h-full border w-full">
        <CommerceSidebar />
      </div>
      <div className="col-span-10 h-full border-b border-r w-full">{children}</div>
    </div>
  );
}
