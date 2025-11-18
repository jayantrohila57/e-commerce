import { FormSection } from '@/shared/components/form/form.helper'
import { ProductVariantBase } from './product-variant.types'
import { ProductVariantCard } from './product-variant-card'

type ProductVariantSectionProps = {
  title: string
  description: string
  products: ProductVariantBase[] | undefined
  productSlug: string
  emptyMessage?: string
}

export const ProductVariantSection = ({
  title,
  description,
  products,
  productSlug,
  emptyMessage = 'No products',
}: ProductVariantSectionProps) => (
  <FormSection
    title={title + ` (${products?.length})`}
    description={description}
  >
    <div className="grid grid-cols-1 gap-2">
      {products && products?.length > 0 ? (
        products?.map((product) => (
          <ProductVariantCard
            href={`/studio/products/${productSlug}/${product.slug}`}
            key={product.id}
            productVariant={product}
          />
        ))
      ) : (
        <p className="text-muted-foreground px-2 text-sm">{emptyMessage}</p>
      )}
    </div>
  </FormSection>
)
