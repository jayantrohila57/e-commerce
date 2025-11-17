import { apiServer, HydrateClient } from '@/core/api/api.server'
import Section from '@/shared/components/layout/section/section'
import { env } from '@/shared/config/env'
import { notFound } from 'next/navigation'
import CodePreview from '@/shared/components/common/code-preview'

export async function generateMetadata({ params }: PageProps<'/store/products/[slug]'>) {
  const { slug } = await params
  const { data } = await apiServer.product.get({
    params: {
      slug,
    },
  })

  if (!data) return notFound()
  return {
    title: data?.title,
    description: data?.description,
    openGraph: {
      title: data?.title,
      description: data?.description,
      url: `${env.NEXT_PUBLIC_BASE_URL}/store/products/${slug}`,
    },
  }
}

export default async function ProductPage({ params }: PageProps<'/store/products/[slug]'>) {
  const { slug } = await params
  const { data } = await apiServer.product.get({
    params: {
      slug,
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
