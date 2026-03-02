import { HydrateClient } from "@/core/api/api.server";
import { getServerSession } from "@/core/auth/auth.server";
import SeriesForm from "@/module/series/series-form";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";
import { notFound, redirect } from "next/navigation";

export const metadata = {
  title: "Add Series",
  description: "Create a new series for your store",
};

export default async function NewSeriesPage({
  params,
  searchParams,
}: PageProps<"/studio/products/categories/[categorySlug]/[subCategorySlug]/new">) {
  const { categorySlug: slug, subCategorySlug: sub } = await params;
  const { id } = await searchParams;
  const { session } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);

  if (!id && !slug && !sub) {
    notFound();
  }

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection {...metadata}>
            <SeriesForm subcategorySlug={sub} categorySlug={slug} subcategoryId={id as string} />
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
