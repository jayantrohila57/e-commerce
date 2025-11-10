'use client'

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Separator } from '@/shared/components/ui/separator'
import { Eye, Lock, EyeOff, LinkIcon, Share, ExternalLink, ChevronDown, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/shared/utils/lib/utils'
import Link from 'next/link'
import { env } from '@/shared/config/env'
import { Route } from 'next'

type Category = {
  visibility: 'public' | 'private' | 'hidden'
  id: string
  createdAt: Date
  updatedAt: Date | null
  slug: string
  title: string
  displayType: 'grid' | 'carousel' | 'banner' | 'list' | 'featured'
  color: string | null
  displayOrder: number
  isFeatured: boolean
  image?: string | null
  description?: string | null
  icon?: string | null
  metaTitle?: string | null
  metaDescription?: string | null
  deletedAt?: Date | null
}

interface CategoryCardProps {
  category: Category
  href?: string
  className?: string
}

const tailwindColor = (color: string) => {
  switch (color) {
    case 'red':
      return 'bg-red-500'
    case 'green':
      return 'bg-green-500'
    case 'blue':
      return 'bg-blue-500'
    case 'yellow':
      return 'bg-yellow-500'
    case 'purple':
      return 'bg-purple-500'
    case 'orange':
      return 'bg-orange-500'
    case 'pink':
      return 'bg-pink-500'
    case 'gray':
      return 'bg-gray-500'
    default:
      return 'bg-gray-500'
  }
}

export function CategoryCard({ category, href, className }: CategoryCardProps) {
  const visibilityIcon = category.visibility === 'public' ? Eye : category.visibility === 'private' ? Lock : EyeOff

  const content = (
    <Card className={cn('hover:bg-muted/50 col-span-1 h-auto w-full gap-0 transition-colors', className)}>
      <CardHeader className="pb-2">
        <CardTitle>{category.title}</CardTitle>
        <CardDescription>{category.description}</CardDescription>
        <CardAction className="">
          <div className="text-muted-foreground flex justify-between text-xs">
            <ChevronRight />
          </div>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex flex-row gap-2">
        {category.visibility && (
          <Badge
            variant="outline"
            className="capitalize"
          >
            {category.visibility}
          </Badge>
        )}
        {category.isFeatured && (
          <Badge
            variant="outline"
            className="capitalize"
          >
            Featured
          </Badge>
        )}
        {category.displayType && (
          <Badge
            variant="outline"
            className="capitalize"
          >
            {category.displayType}
          </Badge>
        )}
      </CardFooter>
    </Card>
  )

  if (href) {
    return <Link href={href as Route}>{content}</Link>
  }

  return content
}
