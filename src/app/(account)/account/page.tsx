import { redirect } from "next/navigation";
import { getServerSession } from "@/core/auth/auth.server";
import AccountRootComponent from "@/module/account/account.layout";
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
    <Section className="bg-muted p-4" {...metadata}>
      <AccountRootComponent />
    </Section>
  );
}
