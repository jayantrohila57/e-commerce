import { Separator } from '@/shared/components/ui/separator'
import { SubCategoryCard } from './subcategory-card'
import { FormSection } from '@/shared/components/form/form.helper'
import { SubcategoryBase } from '../dto/dto.subcategory.contract'

type SubCategory = SubcategoryBase

type CategoriesByType = {
  featuredCategoryType: SubCategory[]
  categoryVisibility: {
    publicCategoryType: SubCategory[]
    privateCategoryType: SubCategory[]
    hiddenCategoryType: SubCategory[]
  }
  recentCategoryType: SubCategory[]
  deletedCategoryType: SubCategory[]
}

type SubCategorySectionProps = {
  slug: string
  title: string
  description: string
  categories: SubCategory[]
  emptyMessage?: string
}

export const SubCategorySection = ({
  slug,
  title,
  description,
  categories,
  emptyMessage = 'No categories',
}: SubCategorySectionProps) => (
  <FormSection
    title={title + ` (${categories?.length})`}
    description={description}
  >
    <div className="grid grid-cols-1 gap-2">
      {categories?.length > 0 ? (
        categories?.map((cat) => (
          <SubCategoryCard
            href={`/studio/products/categories/${slug}/${cat.slug}`}
            key={cat.id}
            data={cat}
          />
        ))
      ) : (
        <p className="text-muted-foreground px-2 text-sm">{emptyMessage}</p>
      )}
    </div>
  </FormSection>
)

export function SubCategoriesSection({ data, slug }: { data: CategoriesByType | null; slug: string }) {
  const {
    featuredCategoryType = [],
    categoryVisibility: { publicCategoryType = [], privateCategoryType = [], hiddenCategoryType = [] } = {},
    recentCategoryType = [],
    deletedCategoryType = [],
  } = data || { categoryVisibility: {} }

  return (
    <div className="flex flex-col gap-2">
      <SubCategorySection
        slug={slug}
        title="Featured Categories"
        description="Featured categories are displayed on the homepage"
        categories={featuredCategoryType}
        emptyMessage="No featured categories"
      />
      <Separator />

      <SubCategorySection
        slug={slug}
        title="Public Categories"
        description="Public categories are displayed on the homepage"
        categories={publicCategoryType}
        emptyMessage="No public categories"
      />
      <Separator />

      <SubCategorySection
        slug={slug}
        title="Private Categories"
        description="Private categories are displayed on the homepage"
        categories={privateCategoryType}
        emptyMessage="No private categories"
      />
      <Separator />

      <SubCategorySection
        slug={slug}
        title="Hidden Categories"
        description="Hidden categories are displayed on the homepage"
        categories={hiddenCategoryType}
        emptyMessage="No hidden categories"
      />
      <Separator />

      <SubCategorySection
        slug={slug}
        title="Recently Added"
        description="Recently added categories are displayed on the homepage"
        categories={recentCategoryType}
        emptyMessage="No recent categories"
      />
      <Separator />

      <SubCategorySection
        slug={slug}
        title="Recently Deleted"
        description="Recently deleted categories are displayed on the homepage"
        categories={deletedCategoryType}
        emptyMessage="No deleted categories"
      />
    </div>
  )
}
