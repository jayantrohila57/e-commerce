import { apiServer, HydrateClient } from '@/core/api/api.server'
import Section from '@/shared/components/layout/section/section'
import { CategoryListing } from '@/module/category/components/category-listing'
import { env } from '@/shared/config/env'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: PageProps<'/store/categories/[categorySlug]'>) {
  const { categorySlug: slug } = await params
  const { data } = await apiServer.category.getBySlug({
    params: {
      slug,
    },
  })

  const category = data?.category
  if (!category) return notFound()
  return {
    title: category?.title,
    description: category?.description,
    openGraph: {
      title: category?.title,
      description: category?.description,
      url: `${env.NEXT_PUBLIC_BASE_URL}/store/categories/${slug}`,
      images: [
        {
          url: category?.image,
        },
      ],
    },
  }
}

export default async function CartPage({ params }: PageProps<'/store/categories/[categorySlug]'>) {
  const { categorySlug: slug } = await params
  const { data } = await apiServer.category.getBySlug({
    params: {
      slug,
    },
  })
  if (!data?.category) return notFound()

  return (
    <HydrateClient>
      <Section>
        <CategoryListing data={data} />
      </Section>
    </HydrateClient>
  )
}
