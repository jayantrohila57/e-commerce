import { Card, CardContent, CardHeader } from '@/shared/components/ui/card'
import { Separator } from '@/shared/components/ui/separator'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { slugToTitle } from '@/shared/utils/lib/url.utils'

export default function CategoriesListingSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="">
        <h2 className="text-4xl">{slugToTitle(String('Loading...'))}</h2>
      </div>
      <Separator className="my-6" />
      <div className="grid-rows-auto mx-auto grid h-full w-full max-w-4xl grid-cols-4 gap-4 rounded-md">
        {[1, 2, 3, 4, 5, 6, 7]?.map((category) => (
          <div
            key={category}
            className="group col-span-1"
          >
            <Card className="border-none bg-transparent shadow-none">
              <CardContent className="flex w-full items-center justify-center">
                <Skeleton className="motion-all bg-secondary aspect-square h-auto w-full rounded-full object-cover object-center p-1 group-hover:drop-shadow" />
              </CardContent>
              <CardHeader className="flex flex-col items-center justify-center">
                <Skeleton className="motion-all h-4 w-24" />
                <Skeleton className="motion-all h-3 w-16" />
              </CardHeader>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
