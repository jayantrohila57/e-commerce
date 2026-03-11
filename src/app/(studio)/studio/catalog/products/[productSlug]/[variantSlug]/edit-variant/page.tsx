import { notFound, redirect } from "next/navigation";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { getServerSession } from "@/core/auth/auth.server";
import VariantEditForm from "@/module/product-variant/product-variant-edit-form";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "Edit Variant",
  description: "Edit a product variant",
};

export default async function EditVariantPage({
  params,
  searchParams,
}: {
  params: Promise<{ productSlug: string; variantSlug: string }>;
  searchParams: Promise<{ id?: string }>;
}) {
  const { productSlug, variantSlug } = await params;
  const { id } = await searchParams;

  const { session } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);

  // Prefer ID (consistent with other Studio edit pages), fall back to slug
  const variantId = id
    ? String(id)
    : (
        await apiServer.productVariant.getBySlug({
          params: { slug: variantSlug },
        })
      )?.data?.id;

  if (!variantId) notFound();

  const { data: variant } = await apiServer.productVariant.get({
    params: { id: variantId },
  });

  if (!variant) notFound();

  const { data: product } = await apiServer.product.get({
    params: { id: variant.productId },
  });

  if (!product) notFound();

  // Fetch all available attributes (no longer scoped to series)
  const { data: defaultAttributes } = await apiServer.attribute.getMany({
    query: {
      limit: 100,
      offset: 0,
    },
  });

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection {...metadata}>
            <VariantEditForm
              productSlug={productSlug}
              variantSlug={variantSlug}
              variant={variant}
              defaultAttributes={defaultAttributes ?? []}
            />
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
