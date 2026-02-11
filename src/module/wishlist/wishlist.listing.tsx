import { apiServer } from '@/core/api/api.server'
import ClearWishlistButton from '@/module/wishlist/clear-wishlist-button'
import RemoveWishlistItemButton from '@/module/wishlist/remove-wishlist-item-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { BlurImage } from '@/shared/components/ui/image'
import { type Route } from 'next'
import Link from 'next/link'
import { type GetUserWishlistOutput } from './wishlist.types'

const computePrice = (basePrice: number, priceModifierValue: number, priceModifierType: string): number => {
  const base = basePrice
  const val = Number(priceModifierValue)

  switch (priceModifierType) {
    case 'flat_increase':
      return base + val
    case 'flat_decrease':
      return base - val
    case 'percent_increase':
      return base + Math.round((base * val) / 100)
    case 'percent_decrease':
      return base - Math.round((base * val) / 100)
    default:
      return base
  }
}

export const WishlistServerList = async () => {
  const { data } = await apiServer.wishlist.getUserWishlist({ query: {} })

  if (!data?.length) {
    return <div className="text-muted-foreground">No items in wishlist.</div>
  }

  const items = data as GetUserWishlistOutput['data']

  return (
    <div className="p-4">
      <div className="mb-4 flex w-full items-center justify-between">
        <div className="text-muted-foreground">{items?.length ?? 0} items</div>
        <ClearWishlistButton />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items?.map((item) => {
          const variant = item?.variant
          const product = item?.variant?.product
          const href = `/store/${product?.categorySlug ?? ''}/${product?.subcategorySlug ?? ''}/${product?.seriesSlug ?? ''}/${variant?.slug ?? ''}`

          const imageSrc = variant?.media?.[0]?.url ?? product?.baseImage
          const title = variant?.title ?? product?.title ?? 'Untitled'
          const price = computePrice(
            product?.basePrice ?? 0,
            Number(variant?.priceModifierValue ?? '0'),
            variant?.priceModifierType ?? 'flat_decrease',
          )

          return (
            <Card
              key={item.id}
              className="relative pt-0"
            >
              <div className="absolute top-3 right-3 z-10">
                <RemoveWishlistItemButton
                  id={item.id}
                  variantId={variant?.id}
                />
              </div>

              <Link
                href={href as Route}
                className="block"
              >
                <CardHeader className="p-0">
                  {imageSrc ? (
                    <BlurImage
                      src={String(imageSrc)}
                      alt={title}
                      width={500}
                      height={500}
                      className="bg-card motion-all aspect-square w-full rounded-md rounded-b-none object-cover group-hover:drop-shadow"
                    />
                  ) : (
                    <div className="bg-muted aspect-square rounded-md rounded-b-none" />
                  )}
                </CardHeader>

                <CardContent className="flex flex-col gap-3 p-4">
                  <div className="flex flex-col gap-1">
                    <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                    <p className="text-sm">₹{price}</p>
                  </div>

                  <div className="mt-auto flex flex-col gap-1">
                    {variant?.attributes?.map((attr) => (
                      <p
                        key={attr.title}
                        className="flex justify-between text-xs"
                      >
                        <span>{attr.title}</span>
                        <span className=" ">{attr.value}</span>
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Link>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
