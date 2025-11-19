import { apiServer, HydrateClient } from '@/core/api/api.server'
import Section from '@/shared/components/layout/section/section'
import { notFound } from 'next/navigation'
import { PDPProduct } from '@/module/product/product-pdp'

export default async function ProductVariantPage({
  params,
}: PageProps<'/store/[categorySlug]/[subCategorySlug]/[seriesSlug]/[variantSlug]'>) {
  const { variantSlug } = await params
  const { data } = await apiServer.product.getPDPProductByVariant({
    params: {
      slug: variantSlug,
    },
  })
  if (!data) return notFound()

  return (
    <HydrateClient>
      <Section>
        <PDPProduct data={data} />
      </Section>
    </HydrateClient>
  )
}
