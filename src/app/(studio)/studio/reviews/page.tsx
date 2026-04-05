import { forbidden, redirect } from "next/navigation";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { getServerSession } from "@/core/auth/auth.server";
import { ReviewTable } from "@/module/review/review.table";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";
import { getListQueryFromSearchParams } from "@/shared/utils/lib/list-query.utils";

export const metadata = {
  title: "Reviews",
  description: "Moderate product reviews and ratings",
};

export default async function StudioReviewsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { session, user } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);
  if (normalizeRole(user?.role) === APP_ROLE.CUSTOMER) forbidden();

  const input = await searchParams;
  const listQuery = getListQueryFromSearchParams(input);

  const isApprovedParam = typeof input.isApproved === "string" ? input.isApproved : undefined;
  const isApproved =
    isApprovedParam && ["true", "false"].includes(isApprovedParam) ? isApprovedParam === "true" : undefined;

  const result = await apiServer.review.getManyAdmin({
    query: {
      limit: listQuery.pagination.limit,
      offset: (listQuery.pagination.page - 1) * listQuery.pagination.limit,
      isApproved,
    },
  });

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection {...metadata}>
            <ReviewTable data={result} />
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
