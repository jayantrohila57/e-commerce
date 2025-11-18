import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Separator } from '@/shared/components/ui/separator'
import CodePreview from '@/shared/components/common/code-preview'
import { GetSeriesBySlugOutput } from './series.types'

export const SeriesItem = ({ data }: { data: GetSeriesBySlugOutput['data'] }) => {
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
