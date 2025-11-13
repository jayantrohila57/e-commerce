import { Badge } from '@/shared/components/ui/badge'
import { ChevronRight, GripVertical } from 'lucide-react'
import { cn, truncateString } from '@/shared/utils/lib/utils'
import Link from 'next/link'
import { Route } from 'next'
import { Button } from '@/shared/components/ui/button'
import { Separator } from '@/shared/components/ui/separator'
import { SubcategoryBase } from '../dto/dto.subcategory.contract'
import { BlurImage } from '@/shared/components/ui/image'

interface SubCategoryCardProps {
  data: SubcategoryBase
  href?: string
  className?: string
}

export function SubCategoryCard({ data, href, className }: SubCategoryCardProps) {
  const content = (
    <div className="bg-secondary flex flex-row items-center justify-start rounded-md border p-2 shadow-xs">
      <BlurImage
        src={String(data?.image)}
        alt={data?.title}
        width={500}
        height={500}
        className="motion-all bg-secondary aspect-square h-auto w-12 rounded-full border object-cover group-hover:drop-shadow"
      />
      <Separator
        orientation="vertical"
        className="mx-2 data-[orientation=vertical]:h-10"
      />
      <div className="flex h-full flex-col">
        <h3 className="text-base font-semibold capitalize">{data.title}</h3>
        <p className="text-muted-foreground text-xs">{truncateString(data.description, 80)}</p>
      </div>
    </div>
  )

  if (href) {
    return <Link href={href as Route}>{content}</Link>
  }

  return content
}
