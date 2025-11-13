import { apiServer, HydrateClient } from '@/core/api/api.server'
import Section from '@/shared/components/layout/section/section'
import { CategoryListing } from '@/module/category/components/category-listing'
import { env } from '@/shared/config/env'
import { notFound } from 'next/navigation'
import CodePreview from '@/shared/components/common/code-preview'

export async function generateMetadata({ params }: PageProps<'/store/categories/[categorySlug]/[subCategorySlug]'>) {
  const { categorySlug, subCategorySlug: slug } = await params
  const { data } = await apiServer.subcategory.getBySlug({
    params: {
      slug,
      categorySlug,
    },
  })

  const subCategory = data?.subcategoryData
  if (!subCategory) return notFound()
  return {
    title: subCategory?.title,
    description: subCategory?.description,
    openGraph: {
      title: subCategory?.title,
      description: subCategory?.description,
      url: `${env.NEXT_PUBLIC_BASE_URL}/store/categories/${slug}`,
      images: [
        {
          url: subCategory?.image,
        },
      ],
    },
  }
}

export default async function CartPage({ params }: PageProps<'/store/categories/[categorySlug]/[subCategorySlug]'>) {
  const { categorySlug, subCategorySlug: slug } = await params
  const { data } = await apiServer.subcategory.getBySlug({
    params: {
      slug,
      categorySlug,
    },
  })
  if (!data?.subcategoryData) return notFound()

  return (
    <HydrateClient>
      <Section>
        <CodePreview json={data} />
      </Section>
    </HydrateClient>
  )
}
