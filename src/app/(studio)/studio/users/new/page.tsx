import type { Route } from "next";
import { forbidden, redirect } from "next/navigation";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { getServerSession } from "@/core/auth/auth.server";
import { SignUpForm } from "@/module/auth/auth.sign-up";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "Create customer",
  description: "Register a new customer account from the studio.",
};

export default async function StudioNewUserPage() {
  const { session, user } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);
  if (normalizeRole(user?.role) !== APP_ROLE.ADMIN) forbidden();

  return (
    <Shell>
      <Shell.Section variant="dashboard">
        <DashboardSection
          title={metadata.title}
          description="Creates a standard sign-up flow. New accounts receive the default role configured for public registration."
          action="Back to users"
          actionUrl={PATH.STUDIO.USERS.ROOT as Route}
        >
          <div className="max-w-md">
            <SignUpForm />
          </div>
        </DashboardSection>
      </Shell.Section>
    </Shell>
  );
}
