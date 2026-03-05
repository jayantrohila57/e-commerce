import { forbidden, redirect } from "next/navigation";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { getServerSession } from "@/core/auth/auth.server";
import { getStudioUsers } from "@/module/user-management/actions/user-management.actions";
import { UserManagementSection } from "@/module/user-management/user-management.section";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "Customers",
  description: "Manage users, roles, and permissions.",
};

export default async function StudioCustomersPage() {
  const { session, user } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);
  if (normalizeRole(user?.role) !== APP_ROLE.ADMIN) forbidden();

  const { users, total } = await getStudioUsers({
    query: {
      limit: 100,
      offset: 0,
    },
  });

  return (
    <Shell>
      <Shell.Section variant="dashboard">
        <DashboardSection {...metadata}>
          <UserManagementSection
            users={users}
            description={`Admin-managed users. Showing ${users.length} of ${total} users.`}
          />
        </DashboardSection>
      </Shell.Section>
    </Shell>
  );
}
