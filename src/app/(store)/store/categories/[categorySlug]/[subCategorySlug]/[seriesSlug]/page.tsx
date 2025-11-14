import { apiServer, HydrateClient } from '@/core/api/api.server'
import { SeriesItem } from '@/module/series/series-listing'
import Section from '@/shared/components/layout/section/section'
import { env } from '@/shared/config/env'
import { notFound } from 'next/navigation'

export async function generateMetadata({
  params,
}: PageProps<'/store/categories/[categorySlug]/[subCategorySlug]/[seriesSlug]'>) {
  const { seriesSlug: slug } = await params
  const { data } = await apiServer.series.getBySlug({
    params: {
      slug,
    },
  })

  const series = data?.seriesData
  if (!series) return notFound()
  return {
    title: series?.title,
    description: series?.description,
    openGraph: {
      title: series?.title,
      description: series?.description,
      url: `${env.NEXT_PUBLIC_BASE_URL}/store/categories/${slug}`,
      images: [
        {
          url: series?.image,
        },
      ],
    },
  }
}

export default async function SeriesPage({
  params,
}: PageProps<'/store/categories/[categorySlug]/[subCategorySlug]/[seriesSlug]'>) {
  const { seriesSlug: slug } = await params
  const { data } = await apiServer.series.getBySlug({
    params: {
      slug,
    },
  })
  if (!data?.seriesData) return notFound()

  return (
    <HydrateClient>
      <Section>
        <div className=""></div>
        <SeriesItem data={data} />
      </Section>
    </HydrateClient>
  )
}
