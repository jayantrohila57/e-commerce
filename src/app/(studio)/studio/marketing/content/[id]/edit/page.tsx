import { forbidden, notFound, redirect } from "next/navigation";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { getServerSession } from "@/core/auth/auth.server";
import { MarketingContentForm } from "@/module/marketing-content/marketing-content-form";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "Edit Marketing Content",
  description: "Edit marketing content blocks",
};

export default async function MarketingContentEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { session, user } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);
  if (normalizeRole(user?.role) === APP_ROLE.CUSTOMER) forbidden();

  const { id } = await params;

  const { data } = await apiServer.marketingContent.get({
    params: { id },
  });

  if (!data) return notFound();

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection {...metadata}>
            <MarketingContentForm
              id={data.id}
              defaultValues={{
                page: data.page,
                section: data.section,
                title: data.title ?? "",
                bodyText: data.bodyText ?? "",
                image: data.image ?? "",
                ctaLabel: data.ctaLabel ?? "",
                ctaLink: data.ctaLink ?? "",
                productLink: data.productLink ?? "",
                items: data.items ?? [],
                displayOrder: data.displayOrder ?? 0,
                isActive: data.isActive ?? true,
                startsAt: data.startsAt ?? undefined,
                endsAt: data.endsAt ?? undefined,
              }}
            />
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
