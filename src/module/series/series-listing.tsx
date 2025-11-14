import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Separator } from '@/shared/components/ui/separator'
import { GetBySlugControllerOutput } from './types.series'
import CodePreview from '@/shared/components/common/code-preview'

export const SeriesItem = ({ data }: { data: Awaited<GetBySlugControllerOutput>['data'] }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="">
        <h2 className="text-4xl capitalize">{data?.seriesData?.title}</h2>
      </div>
      <Separator className="my-6" />
      <div className="grid-rows-auto mx-auto grid h-full w-full max-w-4xl grid-cols-4 gap-4 rounded-md">
        {data?.attributeData?.map((attribute) => (
          <div
            key={attribute?.id}
            className="group col-span-1"
          >
            <Card className="border-none bg-transparent shadow-none">
              <CardHeader className="text-center">
                <CardTitle className="motion-all text-md text-center capitalize group-hover:text-blue-500">
                  {attribute?.title}
                </CardTitle>
                <CardDescription className="motion-all text-center capitalize">{attribute?.value}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
