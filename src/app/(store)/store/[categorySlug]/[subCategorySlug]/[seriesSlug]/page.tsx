import { notFound } from "next/navigation";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { VariantCardList } from "@/module/product/product-series-cards";
import CodePreview from "@/shared/components/common/code-preview";
import Section from "@/shared/components/layout/section/section";

export default async function SeriesPage({
  params,
}: PageProps<"/store/[categorySlug]/[subCategorySlug]/[seriesSlug]">) {
  const { seriesSlug: slug } = await params;
  const { data } = await apiServer.product.getProductsBySeriesSlug({
    params: {
      slug,
    },
  });

  if (!data) return notFound();

  return (
    <HydrateClient>
      <Section>
        <VariantCardList data={data} />
      </Section>
    </HydrateClient>
  );
}
