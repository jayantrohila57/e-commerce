import { apiServer, HydrateClient } from '@/core/api/api.server'
import Section from '@/shared/components/layout/section/section'
import { CategoryItem } from '@/module/category/category.component.all'
import { env } from '@/shared/config/env'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: PageProps<'/store/categories/[categorySlug]'>) {
  const { categorySlug: slug } = await params
  const { data } = await apiServer.category.get({
    params: {
      slug,
    },
  })

  const category = data
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
  const { data } = await apiServer.category.getManyWithSubCategories({
    params: {
      slug,
    },
  })
  if (!data) return notFound()

  return (
    <HydrateClient>
      <Section>
        <CategoryItem data={data} />
      </Section>
    </HydrateClient>
  )
}
