import CodePreview from '@/shared/components/common/code-preview'
import { Separator } from '@/shared/components/ui/separator'
import type { SeriesSelect } from './series.types'

type SeriesItemData = {
  seriesData?: SeriesSelect | null
  [key: string]: unknown
} | null

export const SeriesItem = ({ data }: { data: SeriesItemData }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="">
        <h2 className="text-4xl capitalize">{data?.seriesData?.title}</h2>
      </div>
      <Separator className="my-6" />
      <CodePreview json={data} />
    </div>
  )
}
