import { redirect } from "next/navigation";
import { getServerSession } from "@/core/auth/auth.server";
import AccountUserComponent from "@/module/account/account.user-layout";
import { AccountSidebar } from "@/module/account/account-sidebar";
import Section from "@/shared/components/layout/section/section";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "Account",
  description: "Account settings",
};

export default async function AccountPage() {
  const session = await getServerSession();
  if (!session) return redirect(PATH.ROOT);
  return (
    <Section {...metadata}>
      <div className="grid h-full min-h-[800px] w-full grid-cols-12 shadow-none">
        <div className="col-span-2 h-full  border-b w-full">
          <AccountSidebar />
        </div>
        <div className="col-span-10 h-full p-4 border-b border-r w-full">
          <AccountUserComponent />
        </div>
      </div>
    </Section>
  );
}
