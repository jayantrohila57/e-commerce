import { HydrateClient } from "@/core/api/api.server";
import { getServerSession } from "@/core/auth/auth.server";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";
import { notFound, redirect } from "next/navigation";
import SubcategoryForm from "@/module/subcategory/subcategory-form";

export const metadata = {
  title: "Add Subcategory",
  description: "Create a new subcategory for your store",
};

export default async function NewSubcategoryPage({
  params,
  searchParams,
}: PageProps<"/studio/products/categories/[categorySlug]/new">) {
  const { categorySlug: slug } = await params;
  const { id } = await searchParams;
  const { session } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);

  if (!id && !slug) {
    notFound();
  }

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection
            title="Create New Subcategory"
            description="Add a new subcategory to organize your products"
          >
            <SubcategoryForm categorySlug={slug} categoryId={String(id)} />
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
