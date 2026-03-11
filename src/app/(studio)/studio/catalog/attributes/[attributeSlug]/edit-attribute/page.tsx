import { notFound, redirect } from "next/navigation";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { getServerSession } from "@/core/auth/auth.server";
import AttributeEditForm from "@/module/attribute/attribute.component.edit-form";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "Edit Attribute",
  description: "Edit an attribute",
};

export default async function EditAttributePage({
  searchParams,
}: PageProps<"/studio/catalog/attributes/[attributeSlug]/edit-attribute">) {
  const { id } = await searchParams;
  const { session } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);

  if (!id) notFound();

  const { data: attr } = await apiServer.attribute.get({ params: { id: String(id) } });

  if (!attr) notFound();

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection {...metadata}>
            <AttributeEditForm attribute={attr} />
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
