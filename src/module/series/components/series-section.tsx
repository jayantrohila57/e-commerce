import { Separator } from '@/shared/components/ui/separator'
import { SeriesCard } from './series-card'
import { FormSection } from '@/shared/components/form/form.helper'
import type { Series } from '../dto/dto.series.schema'
import { GetManySeriesOutput } from '../dto/types.series'

type SeriesSectionProps = {
  categorySlug: string
  subcategorySlug: string
  title: string
  description: string
  series: GetManySeriesOutput['data']
  emptyMessage?: string
}

export const SeriesSection = ({
  categorySlug,
  subcategorySlug,
  title,
  description,
  series,
  emptyMessage = 'No series',
}: SeriesSectionProps) => (
  <FormSection
    title={`${title} (${series?.length || 0})`}
    description={description}
  >
    <div className="grid grid-cols-1 gap-2">
      {(series ?? [])?.length > 0 ? (
        series?.map((srs) => (
          <SeriesCard
            key={srs.id}
            href={`/studio/products/categories/${categorySlug}/${subcategorySlug}/${srs.slug}`}
            data={srs}
          />
        ))
      ) : (
        <p className="text-muted-foreground px-2 text-sm">{emptyMessage}</p>
      )}
    </div>
  </FormSection>
)
