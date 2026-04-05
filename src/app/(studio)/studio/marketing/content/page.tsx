import type { Route } from "next";
import { forbidden, redirect } from "next/navigation";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { getServerSession } from "@/core/auth/auth.server";
import MarketingContentTable from "@/module/marketing-content/marketing-content.table";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";
import { getListQueryFromSearchParams } from "@/shared/utils/lib/list-query.utils";

export const metadata = {
  title: "Marketing Content",
  description: "Manage marketing content blocks like banners, CTAs, and announcements",
};

export default async function MarketingContentPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { session, user } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);
  if (normalizeRole(user?.role) === APP_ROLE.CUSTOMER) forbidden();

  const input = await searchParams;
  const listQuery = getListQueryFromSearchParams(input);

  const pageFilter = typeof input.page === "string" ? input.page : undefined;
  const sectionFilter = typeof input.section === "string" ? input.section : undefined;
  const isActiveParam = typeof input.isActive === "string" ? input.isActive : undefined;
  const isActive = isActiveParam === "true" ? true : isActiveParam === "false" ? false : undefined;

  const result = await apiServer.marketingContent.getMany({
    query: {
      offset: listQuery.pagination.offset,
      limit: listQuery.pagination.limit,
      page: pageFilter as
        | "home"
        | "store"
        | "store_category"
        | "store_subcategory"
        | "product"
        | "checkout"
        | "about"
        | "newsletter"
        | "support"
        | undefined,
      section: sectionFilter as
        | "promo_banner"
        | "cta"
        | "offer_banner"
        | "crousel"
        | "split_banner"
        | "announcement_bar"
        | "feature_highlight"
        | undefined,
      isActive,
    },
  });

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection
            title={metadata.title}
            description={metadata.description}
            action="Add Content"
            actionUrl={PATH.STUDIO.MARKETING.CONTENT.NEW as Route}
          >
            <MarketingContentTable data={result} />
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
