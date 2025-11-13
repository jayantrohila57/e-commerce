import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { GetCategoriesOutput } from '../dto/types.category'
import { BlurImage } from '@/shared/components/ui/image'
import Link from 'next/link'
import { Separator } from '@/shared/components/ui/separator'
import { truncateString } from '@/shared/utils/lib/utils'

export default function CategoriesListing({ data }: { data: GetCategoriesOutput['data'] }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="">
        <h2 className="text-4xl">Categories</h2>
      </div>
      <Separator className="my-6" />
      <div className="grid-rows-auto mx-auto grid h-full w-full max-w-4xl grid-cols-4 gap-4 rounded-md">
        {data?.map((category) => (
          <div
            key={category.id}
            className="group col-span-1"
          >
            <Link href={`/store/categories/${category.slug}`}>
              <Card className="border-none bg-transparent shadow-none">
                <CardContent className="flex w-full items-center justify-center">
                  <BlurImage
                    src={String(category.image)}
                    alt={category.title}
                    width={500}
                    height={500}
                    className="motion-all bg-secondary aspect-square h-auto w-full rounded-full border object-cover group-hover:drop-shadow"
                  />
                </CardContent>
                <CardHeader className="text-center">
                  <CardTitle className="motion-all text-md text-center capitalize group-hover:text-blue-500">
                    {category.title}
                  </CardTitle>
                  <CardDescription className="motion-all text-center text-xs capitalize">
                    {truncateString(category.description, 50)}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
