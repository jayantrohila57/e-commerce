import type { Route } from "next";
import { forbidden, redirect } from "next/navigation";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { getServerSession } from "@/core/auth/auth.server";
import AttributesSection from "@/module/attribute/attribute.component.section";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "Attributes",
  description: "Manage product attributes",
};

export default async function AttributesPage() {
  const { session, user } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);
  if (normalizeRole(user?.role) === APP_ROLE.CUSTOMER) forbidden();

  const [{ data: attributes }, { data: series }] = await Promise.all([
    apiServer.attribute.getMany({ query: { limit: 100, offset: 0 } }),
    apiServer.series.getMany({ query: { limit: 100, offset: 0 } }),
  ]);

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection {...metadata} action="Add Attribute" actionUrl={PATH.STUDIO.ATTRIBUTES.NEW as Route}>
            <AttributesSection initialAttributes={attributes ?? []} initialSeries={series ?? []} />
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
