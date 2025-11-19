import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import Image from 'next/image'
import { GetPDPProductOutput } from './product.types'

export const PDPProduct = ({ data }: { data: GetPDPProductOutput['data'] }) => {
  if (!data?.product) {
    return <div>Product not found</div>
  }

  const { product } = data
  const selectedVariant = product?.variant

  // Ensure we have valid numeric values
  const basePrice = Number(product?.basePrice) || 0
  const price = selectedVariant?.priceModifierValue
    ? selectedVariant.priceModifierType === 'percent_increase'
      ? basePrice * (1 + Number(selectedVariant.priceModifierValue) / 100)
      : basePrice + Number(selectedVariant.priceModifierValue)
    : basePrice

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
            {selectedVariant?.media?.[0]?.url ? (
              <Image
                src={selectedVariant.media[0].url}
                alt={product?.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">No image available</div>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div
              key={selectedVariant?.id}
              className="aspect-square overflow-hidden rounded-md border"
            >
              {selectedVariant?.media?.[0]?.url && (
                <Image
                  src={selectedVariant.media[0].url}
                  alt={selectedVariant.title}
                  width={100}
                  height={100}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{product?.title}</h1>
            <p className="mt-2 text-lg text-gray-600">{product?.description}</p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold">${(price || 0).toFixed(2)}</span>
            {selectedVariant?.priceModifierValue && (
              <Badge
                variant="outline"
                className="text-sm"
              >
                {selectedVariant.priceModifierType === 'percent_increase'
                  ? `+${selectedVariant.priceModifierValue}%`
                  : `+$${selectedVariant.priceModifierValue}`}
              </Badge>
            )}
          </div>

          {selectedVariant && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Variant: {selectedVariant.title}</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedVariant.attributes?.map((attr, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                    >
                      {attr.title}: {attr.value}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Available Variants</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    key={selectedVariant.id}
                    variant={selectedVariant.id === selectedVariant.id ? 'default' : 'outline'}
                    size="sm"
                    className="capitalize"
                  >
                    {selectedVariant.title}
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-4 pt-4">
            <Button
              size="lg"
              className="flex-1"
            >
              Add to Cart
            </Button>
            <Button
              size="lg"
              variant="outline"
            >
              Buy Now
            </Button>
          </div>

          <div className="space-y-4 pt-6">
            <div>
              <h3 className="font-medium">Description</h3>
              <p className="text-sm text-gray-600">{product?.description}</p>
            </div>

            <div>
              <h3 className="font-medium">Features</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600">
                {product?.features?.map((f, i) => <li key={i}>{f?.title}</li>) || <li>No features listed</li>}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
