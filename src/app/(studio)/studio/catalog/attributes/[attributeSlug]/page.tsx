import type { Route } from "next";
import { forbidden, notFound, redirect } from "next/navigation";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { getServerSession } from "@/core/auth/auth.server";
import { AttributePreviewCard } from "@/module/attribute/attribute.component.preview";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";
import { slugToTitle } from "@/shared/utils/lib/url.utils";

export default async function AttributeDetailPage({ params }: PageProps<"/studio/catalog/attributes/[attributeSlug]">) {
  const { attributeSlug } = await params;
  const { session, user } = await getServerSession();

  if (!session) return redirect(PATH.ROOT);
  if (normalizeRole(user?.role) === APP_ROLE.CUSTOMER) forbidden();

  const { data } = await apiServer.attribute.getBySlug({
    params: { slug: attributeSlug },
  });

  if (!data) {
    notFound();
  }

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection
            title={slugToTitle(attributeSlug)}
            description="Manage this product attribute and its usage across your catalog."
            action="Edit Attribute"
            actionUrl={PATH.STUDIO.ATTRIBUTES.EDIT(attributeSlug, data.id) as Route}
          >
            <div className="grid h-full w-full grid-cols-6 gap-2">
              <div className="col-span-6 h-full w-full rounded-md">
                <AttributePreviewCard data={data} />
              </div>
            </div>
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
