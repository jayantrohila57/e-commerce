import { apiServer, HydrateClient } from '@/core/api/api.server'
import Section from '@/shared/components/layout/section/section'
import { env } from '@/shared/config/env'
import { notFound } from 'next/navigation'
import CodePreview from '@/shared/components/common/code-preview'

export default async function ProductPage({ params }: PageProps<'/store/products/[productSlug]'>) {
  const { productSlug } = await params
  const { data } = await apiServer.product.getProductsBySeriesSlug({
    params: {
      slug: productSlug,
    },
  })
  if (!data) return notFound()

  return (
    <HydrateClient>
      <Section>
        <CodePreview json={data} />
      </Section>
    </HydrateClient>
  )
}
