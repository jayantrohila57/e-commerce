import { notFound, redirect } from "next/navigation";
import { HydrateClient } from "@/core/api/api.server";
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
}: PageProps<"/studio/products/[productSlug]/new">) {
  const { productSlug: slug } = await params;
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
          <DashboardSection title="Create New Variant" description="Add a new variant to organize your products">
            <VariantForm productSlug={slug} productId={id as string} />
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
