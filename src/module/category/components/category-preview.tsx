'use client'

import Image from 'next/image'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { GlobeIcon, EyeOffIcon, StarIcon, LayoutGridIcon } from 'lucide-react'
import { cn } from '@/shared/utils/lib/utils'
import { useFormContext } from 'react-hook-form'

interface CategoryPreviewCardProps {
  title: string
  slug: string
  description?: string | null
  image?: string | null
  color?: string
  displayType: string
  visibility: string
  isFeatured?: boolean
}

export function CategoryPreviewCard() {
  const { watch } = useFormContext()

  const {
    title,
    slug,
    description,
    image,
    color = '#FFFFFF',
    displayType,
    visibility,
    isFeatured = false,
  } = watch('body')
  const visibilityIcon = visibility === 'public' ? GlobeIcon : visibility === 'private' ? EyeOffIcon : LayoutGridIcon

  const Icon = visibilityIcon

  return (
    <Card
      className={cn('relative overflow-hidden border-2 transition-all duration-200 hover:shadow-lg', 'rounded-2xl')}
      style={{ borderColor: color }}
    >
      {image ? (
        <div className="relative aspect-video w-full">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0" />
        </div>
      ) : (
        <div
          className="bg-muted flex aspect-video w-full items-center justify-center"
          style={{ backgroundColor: color }}
        >
          <LayoutGridIcon className="text-muted-foreground h-10 w-10" />
        </div>
      )}

      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            {title}
            {isFeatured && <StarIcon className="h-4 w-4 text-yellow-500" />}
          </CardTitle>
          <Badge
            variant="secondary"
            className="flex items-center gap-1 text-xs"
          >
            <Icon className="h-3 w-3" />
            {visibility}
          </Badge>
        </div>
        <CardDescription className="text-muted-foreground text-sm">/{slug}</CardDescription>
      </CardHeader>

      <CardContent>
        {description && <p className="text-muted-foreground line-clamp-3 text-sm">{description}</p>}
        <div className="mt-4 flex items-center justify-between">
          <Badge
            variant="outline"
            className="text-xs capitalize"
            style={{ borderColor: color, color }}
          >
            {displayType}
          </Badge>
          <div
            className="h-5 w-5 rounded-full border"
            style={{ backgroundColor: color, borderColor: color }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
