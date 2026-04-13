import { redirect } from "next/navigation";
import { getServerSession } from "@/core/auth/auth.server";
import { AccountSection } from "@/module/account/account-section";
import { CookiePrivacySettings } from "@/module/cookies/cookie-privacy-settings";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "Privacy Settings",
  description: "Manage cookie consent and privacy preferences",
};

export default async function PrivacySettingsPage() {
  const data = await getServerSession();
  if (!data?.session) return redirect(PATH.ROOT);

  return (
    <AccountSection {...metadata}>
      <div className="max-w-3xl p-4">
        <CookiePrivacySettings />
      </div>
    </AccountSection>
  );
}
