import { Badge } from '@/shared/components/ui/badge'
import {
  Globe,
  EyeOff,
  Star,
  LayoutGrid,
  Clock,
  Calendar,
  Tag,
  Eye,
  EyeOff as EyeOffIcon,
  Trash2,
  ExternalLink,
  ImageIcon,
  Trash,
  PencilIcon,
} from 'lucide-react'
import { cn } from '@/shared/utils/lib/utils'
import { GetCategoryOutput } from '../dto/types.category'
import { FormSection } from '@/shared/components/form/form.helper'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import { format, formatDistanceToNow } from 'date-fns'
import { Button } from '@/shared/components/ui/button'
import Link from 'next/link'
import { PATH } from '@/shared/config/routes'
import { Route } from 'next'
import { CategoryDelete } from './category-delete'

type CategoryPreviewCardProps = {
  data: GetCategoryOutput['data']
  className?: string
}

const formatValue = (key: string, value: any) => {
  if (value === null || value === undefined) return 'N/A'

  // Format dates
  if (['createdAt', 'updatedAt', 'deletedAt'].includes(key) && value) {
    return format(new Date(value), 'PPPpp')
  }

  // Format boolean values
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }

  // Handle arrays and objects
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(', ') : 'None'
  }

  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2)
  }

  return String(value)
}

export function CategoryPreviewCard({ data }: CategoryPreviewCardProps) {
  if (!data) return null

  const filteredData = Object.entries(data).filter(
    ([key]) => !['parentId', 'deletedAt', 'displayOrder', 'metaTitle', 'metaDescription'].includes(key),
  )

  return (
    <FormSection
      title="Details"
      description="Category details"
    >
      <div className="grid h-full w-full grid-cols-12">
        <div className="bg-secondary col-span-11 h-full w-full rounded-lg border shadow-xs">
          <Table>
            <TableBody>
              {filteredData.map(([key, value]) => {
                const formattedValue = formatValue(key, value)
                return (
                  <TableRow key={key}>
                    <TableCell className="text-muted-foreground font-medium">
                      <div className="flex items-center">
                        {key === 'isFeatured' && <Star className="mr-2 h-3.5 w-3.5 opacity-70" />}
                        {key === 'visibility' && <Eye className="mr-2 h-3.5 w-3.5 opacity-70" />}
                        {key === 'displayType' && <LayoutGrid className="mr-2 h-3.5 w-3.5 opacity-70" />}
                        {key === 'createdAt' && <Calendar className="mr-2 h-3.5 w-3.5 opacity-70" />}
                        {key === 'updatedAt' && <Clock className="mr-2 h-3.5 w-3.5 opacity-70" />}
                        {key === 'deletedAt' && <Trash2 className="mr-2 h-3.5 w-3.5 opacity-70" />}
                        {key === 'image' && <ImageIcon className="mr-2 h-3.5 w-3.5 opacity-70" />}
                        {key === 'color' && <Globe className="mr-2 h-3.5 w-3.5 opacity-70" />}
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">
                      {typeof formattedValue === 'string' && formattedValue.startsWith('http') ? (
                        <a
                          href={formattedValue}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary flex items-center hover:underline"
                        >
                          {formattedValue.split('/').pop()}
                          <ExternalLink className="ml-1 h-3 w-3 opacity-70" />
                        </a>
                      ) : (
                        <span
                          className={cn(
                            'font-mono text-sm',
                            typeof value === 'boolean' && 'font-semibold',
                            value === null && 'text-muted-foreground italic',
                          )}
                        >
                          {formattedValue}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
        <div className="col-span-1 flex h-full w-full flex-col items-end justify-start gap-2 p-2">
          <Link href={PATH.STUDIO.CATEGORIES.EDIT(String(data?.slug), String(data?.id)) as Route}>
            <Button
              variant={'default'}
              size={'icon'}
            >
              <PencilIcon />
            </Button>
          </Link>
          <CategoryDelete categoryId={String(data?.id)} />
        </div>
      </div>
    </FormSection>
  )
}
