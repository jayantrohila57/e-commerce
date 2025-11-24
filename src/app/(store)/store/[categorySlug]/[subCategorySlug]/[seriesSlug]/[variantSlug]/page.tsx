import { apiServer, HydrateClient } from '@/core/api/api.server'
import Section from '@/shared/components/layout/section/section'
import { notFound } from 'next/navigation'
import { PDPProduct } from '@/module/product/product-pdp'

export const revalidate = 300

type ROUTE = '/store/[categorySlug]/[subCategorySlug]/[seriesSlug]/[variantSlug]'

export async function generateMetadata({ params }: PageProps<ROUTE>) {
  const { variantSlug } = await params

  const { data } = await apiServer.product.getPDPProductByVariant({
    params: { slug: variantSlug },
  })

  if (!data) {
    return {
      title: 'Product not found',
      description: 'The requested product variant does not exist.',
    }
  }

  return {
    title: data.product.metaTitle ?? data.product.title,
    description: data.product.metaDescription ?? data.product.description,
    openGraph: {
      title: data.product.metaTitle ?? data.product.title,
      description: data.product.metaDescription ?? data.product.description,
      image: data.product.baseImage,
    },
    twitter: {
      card: 'summary_large_image',
      title: data.product.metaTitle ?? data.product.title,
      description: data.product.metaDescription ?? data.product.description,
      image: data.product.baseImage,
    },
  }
}

export default async function ProductVariantPage({ params }: PageProps<ROUTE>) {
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
        <PDPProduct
          data={data}
          slug={variantSlug}
        />
      </Section>
    </HydrateClient>
  )
}
