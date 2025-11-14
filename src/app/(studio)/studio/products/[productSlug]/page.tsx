import { apiServer, HydrateClient } from '@/core/api/api.server'
import { ProductPreviewCard } from '@/module/product/product-preview'
import DashboardSection from '@/shared/components/layout/section/section-dashboard'
import Shell from '@/shared/components/layout/shell'
import { Separator } from '@/shared/components/ui/separator'
import { PATH } from '@/shared/config/routes'
import { slugToTitle } from '@/shared/utils/lib/url.utils'
import { Route } from 'next'

export default async function ProductPage({ params }: PageProps<'/studio/products/[productSlug]'>) {
  const { productSlug: slug } = await params
  const { data } = await apiServer.product.getBySlug({
    params: {
      slug,
    },
  })

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection
            title={slugToTitle(slug)}
            description="Manage your product categories and subcategories"
            action="Add Variants"
            actionUrl={PATH.STUDIO.SUB_CATEGORIES.NEW(String(data?.product?.id), slug) as Route}
          >
            <div className="grid h-full w-full grid-cols-6 gap-2">
              <div className="col-span-6 h-full w-full rounded-md">
                {data?.product && <ProductPreviewCard data={data?.product} />}
              </div>
              {/* <div className="col-span-6 h-full w-full rounded-md">
                <Separator className="my-2" />
                {data?.subcategories && (
                  <SubProductSection
                    slug={slug}
                    title="SubCategories"
                    description="Sub categories are displayed on the homepage"
                    categories={data?.subcategories}
                    emptyMessage="No SubCategories"
                  />
                )}
              </div> */}
            </div>
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  )
}
