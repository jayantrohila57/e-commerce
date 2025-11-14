import { Separator } from '@/shared/components/ui/separator'
import { ProductBase } from './product.types'
import { FormSection } from '@/shared/components/form/form.helper'
import { ProductCard } from './product-card'

type Product = ProductBase

type CategoriesByType = {
  featuredProductType: Product[]
  productVisibility: {
    publicProductType: Product[]
    privateProductType: Product[]
    hiddenProductType: Product[]
  }
  recentProductType: Product[]
  deletedProductType: Product[]
}

type ProductSectionProps = {
  title: string
  description: string
  products: Product[] | null
  emptyMessage?: string
}

export const ProductSection = ({ title, description, products, emptyMessage = 'No products' }: ProductSectionProps) => (
  <FormSection
    title={title + ` (${products?.length})`}
    description={description}
  >
    <div className="grid grid-cols-1 gap-2">
      {products && products?.length > 0 ? (
        products?.map((product) => (
          <ProductCard
            href={`/studio/products/${product.slug}`}
            key={product.id}
            product={product}
          />
        ))
      ) : (
        <p className="text-muted-foreground px-2 text-sm">{emptyMessage}</p>
      )}
    </div>
  </FormSection>
)

export function ProductsSection({ data }: { data: CategoriesByType | null }) {
  const {
    featuredProductType = [],
    productVisibility: { publicProductType = [], privateProductType = [], hiddenProductType = [] } = {},
    recentProductType = [],
    deletedProductType = [],
  } = data || { productVisibility: {} }

  return (
    <div className="flex flex-col gap-2">
      <ProductSection
        title="Featured Categories"
        description="Featured products are displayed on the homepage"
        products={featuredProductType}
        emptyMessage="No featured products"
      />
      <Separator />

      <ProductSection
        title="Public Categories"
        description="Public products are displayed on the homepage"
        products={publicProductType}
        emptyMessage="No public products"
      />
      <Separator />

      <ProductSection
        title="Private Categories"
        description="Private products are displayed on the homepage"
        products={privateProductType}
        emptyMessage="No private products"
      />
      <Separator />

      <ProductSection
        title="Hidden Categories"
        description="Hidden products are displayed on the homepage"
        products={hiddenProductType}
        emptyMessage="No hidden products"
      />
      <Separator />

      <ProductSection
        title="Recently Added"
        description="Recently added products are displayed on the homepage"
        products={recentProductType}
        emptyMessage="No recent products"
      />
      <Separator />

      <ProductSection
        title="Recently Deleted"
        description="Recently deleted products are displayed on the homepage"
        products={deletedProductType}
        emptyMessage="No deleted products"
      />
    </div>
  )
}
