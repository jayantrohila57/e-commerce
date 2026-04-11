import { notFound, redirect } from "next/navigation";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { getServerSession } from "@/core/auth/auth.server";
import SubcategoryEditForm from "@/module/subcategory/subcategory.component.edit-form";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";
import { slugToTitle } from "@/shared/utils/lib/url.utils";

export const metadata = {
  title: "Edit Subcategory",
  description: "Edit a subcategory for your store",
};

export default async function EditSubcategoryPage({
  params,
  searchParams,
}: PageProps<"/studio/catalog/categories/[categorySlug]/[subCategorySlug]/edit-subcategory">) {
  const { categorySlug: slug, subCategorySlug: sub } = await params;
  const { id } = await searchParams;
  const { session } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);

  const { data } = await apiServer.subcategory.get({
    params: {
      ...(id ? { id: String(id) } : {}),
      ...(sub ? { slug: sub } : {}),
      ...(slug ? { categorySlug: slug } : {}),
    },
  });

  if ((!id && !sub) || !data) {
    notFound();
  }

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection title={slugToTitle(sub)} description="Manage your subcategory settings">
            <SubcategoryEditForm subcategory={data} categorySlug={slug} />
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
