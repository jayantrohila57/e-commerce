import {
  Globe,
  Star,
  LayoutGrid,
  Clock,
  Calendar,
  Tag,
  Eye,
  Trash2,
  ExternalLink,
  ImageIcon,
  PencilIcon,
  Hash,
  Box,
} from 'lucide-react'
import { cn, truncateString } from '@/shared/utils/lib/utils'
import { FormSection } from '@/shared/components/form/form.helper'
import { Table, TableBody, TableCell, TableRow } from '@/shared/components/ui/table'
import { format } from 'date-fns'
import { Button } from '@/shared/components/ui/button'
import Link from 'next/link'
import { PATH } from '@/shared/config/routes'
import { Route } from 'next'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { BlurImage } from '@/shared/components/ui/image'
import { Separator } from '@/shared/components/ui/separator'
import { GetProductOutput } from './dto.product.types'
import { ProductDelete } from './product-delete'

type ProductPreviewCardProps = {
  data: GetProductOutput['data']
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

export function ProductPreviewCard({ data }: ProductPreviewCardProps) {
  if (!data) return null

  const filteredData = Object.entries(data).filter(
    ([key]) =>
      ![
        'parentId',
        'deletedAt',
        'displayOrder',
        'metaTitle',
        'metaDescription',
        'description',
        'image',
        'title',
      ].includes(key),
  )

  return (
    <FormSection
      title="Details"
      description="Categories are displayed on the homepage"
    >
      <Card className="bg-secondary p-2 shadow-none">
        <div className="flex flex-row gap-4">
          <CardContent className="flex w-fit items-start justify-start p-0">
            <BlurImage
              src={String(data.baseImage ?? '')}
              alt={data.title}
              width={500}
              height={500}
              className="motion-all bg-secondary aspect-square h-auto w-26 rounded-full border object-cover group-hover:drop-shadow hover:w-40"
            />
          </CardContent>
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-20"
          />
          <CardHeader className="h-full w-full p-0">
            <CardTitle className="motion-all capitalize">{data.title}</CardTitle>
            <CardDescription className="motion-all max-w-lg text-xs capitalize">
              {truncateString(data.description, 500)}
            </CardDescription>
            <CardAction>
              <div className="col-span-1 flex h-full w-full flex-row items-end justify-start gap-2">
                <Link href={PATH.STUDIO.CATEGORIES.EDIT(String(data?.slug), String(data?.id)) as Route}>
                  <Button
                    variant={'default'}
                    size={'icon'}
                  >
                    <PencilIcon />
                  </Button>
                </Link>
                <ProductDelete productId={String(data?.id)} />
              </div>
            </CardAction>
          </CardHeader>
        </div>
        <Separator className="" />
        <CardContent className="w-full p-0">
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
                        {key === 'slug' && <Tag className="mr-2 h-3.5 w-3.5 opacity-70" />}
                        {key === 'id' && <Hash className="mr-2 h-3.5 w-3.5 opacity-70" />}
                        {key === 'icon' && <Box className="mr-2 h-3.5 w-3.5 opacity-70" />}
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
        </CardContent>
      </Card>
    </FormSection>
  )
}
