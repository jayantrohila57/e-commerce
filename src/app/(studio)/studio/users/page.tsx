import { forbidden, redirect } from "next/navigation";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { getServerSession } from "@/core/auth/auth.server";
import { getStudioUsers } from "@/module/user-management/actions/user-management.actions";
import UserTable from "@/module/user-management/user.table";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";
import { getListQueryFromSearchParams } from "@/shared/utils/lib/list-query.utils";

export const metadata = {
  title: "Customers",
  description: "Manage users, roles, and permissions.",
};

export default async function StudioCustomersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { session, user } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);
  if (normalizeRole(user?.role) !== APP_ROLE.ADMIN) forbidden();

  const input = await searchParams;
  const listQuery = getListQueryFromSearchParams(input);

  const userList = await getStudioUsers({
    query: {
      limit: listQuery.pagination.limit,
      offset: listQuery.pagination.offset,
      searchValue: listQuery.search.q,
      searchField: "email",
      searchOperator: "contains",
    },
  });

  return (
    <Shell>
      <Shell.Section variant="dashboard">
        <DashboardSection {...metadata}>
          <UserTable data={userList} />
        </DashboardSection>
      </Shell.Section>
    </Shell>
  );
}
