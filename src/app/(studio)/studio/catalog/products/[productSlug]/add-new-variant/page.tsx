import { notFound, redirect } from "next/navigation";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { getServerSession } from "@/core/auth/auth.server";
import VariantForm from "@/module/product-variant/product-variant-add-form";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "Add Variant",
  description: "Create a new variant for your store",
};

export default async function NewVariantPage({
  params,
  searchParams,
}: PageProps<"/studio/catalog/products/[productSlug]/add-new-variant">) {
  const { productSlug: slug } = await params;
  const { id } = await searchParams;
  const { session } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);

  if (!id && !slug) {
    notFound();
  }

  const { data: product } = await apiServer.product.get({
    params: {
      id: String(id),
    },
  });

  if (!product) notFound();

  const { data: seriesAttributes } = await apiServer.attribute.getMany({
    query: {
      seriesSlug: product.seriesSlug,
      limit: 100,
      offset: 0,
    },
  });

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection title="Create New Variant" description="Add a new variant to organize your products">
            <VariantForm productSlug={slug} productId={id as string} seriesAttributes={seriesAttributes ?? []} />
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
