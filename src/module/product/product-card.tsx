import { truncateString } from '@/shared/utils/lib/utils'
import Link from 'next/link'
import { Route } from 'next'
import { Separator } from '@/shared/components/ui/separator'
import { BlurImage } from '@/shared/components/ui/image'
import { ProductBase } from './product.types'

interface ProductCardProps {
  product: ProductBase
  href?: string
}

export function ProductCard({ product, href }: ProductCardProps) {
  const content = (
    <div className="bg-secondary flex flex-row items-center justify-start rounded-md border p-2 shadow-xs">
      <BlurImage
        src={String(product?.id ?? '')}
        alt={product?.title}
        width={500}
        height={500}
        className="motion-all bg-secondary aspect-square h-auto w-12 rounded-full border object-cover group-hover:drop-shadow"
      />
      <Separator
        orientation="vertical"
        className="mx-4 data-[orientation=vertical]:h-8"
      />
      <div className="flex h-full flex-col">
        <h3 className="text-base font-semibold capitalize">{product.title}</h3>
        <p className="text-muted-foreground text-xs">{truncateString(product.description, 80)}</p>
      </div>
    </div>
  )

  if (href) {
    return <Link href={href as Route}>{content}</Link>
  }

  return content
}
