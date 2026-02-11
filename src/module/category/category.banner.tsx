'use client'

import * as React from 'react'
import Autoplay from 'embla-carousel-autoplay'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { ChevronRightCircle, Squircle } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/shared/components/ui/carousel'
import { cn } from '@/shared/utils/lib/utils'
import { BlurImage } from '@/shared/components/ui/image'
import { type CategoryBase } from './category.types'

export function CategoryBanner({ data }: { data: CategoryBase[] | null }) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const autoplay = React.useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
      stopOnFocusIn: true,
      stopOnLastSnap: true,
    }),
  )
  React.useEffect(() => {
    if (!api) {
      return
    }
    setCurrent(api.selectedScrollSnap() + 1)
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])
  return (
    <Carousel
      className="w-full"
      opts={{ loop: true, align: 'start', dragFree: false }}
      plugins={[autoplay.current]}
      setApi={setApi}
    >
      <div className="">
        <CarouselContent className="py-4">
          {data?.map((category, i) => {
            return (
              <CarouselItem
                key={i}
                className="aspect-21/9"
              >
                <Card
                  key={category?.title}
                  className="bg-secondary group aspect-21/9 text-balance"
                >
                  <CardContent className="flex h-auto w-full items-center justify-center overflow-hidden">
                    <BlurImage
                      src={String(category?.image)}
                      alt={category?.title}
                      width={1920}
                      height={1080}
                      className="motion-all aspect-21/9 h-auto w-full object-contain"
                    />
                  </CardContent>
                  <CardHeader>
                    <div className="flex flex-row items-center justify-start gap-2">
                      <CardTitle className="text-3xl font-semibold">{category?.title}</CardTitle>
                    </div>
                    <CardDescription className="text-base">{category?.description}</CardDescription>
                    <CardAction>
                      <ChevronRightCircle className="text-primary" />
                    </CardAction>
                  </CardHeader>
                </Card>
              </CarouselItem>
            )
          })}
        </CarouselContent>
      </div>
      <div className="container mx-auto flex w-full flex-row justify-between">
        <div className="flex h-8 w-full items-center justify-start gap-2">
          {data?.map((_, i) => (
            <Squircle
              key={i}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                'h-4 w-4 stroke-2',
                i === current - 1 ? 'text-primary fill-primary' : 'text-muted-foreground',
              )}
            />
          ))}
        </div>
        <div className="flex flex-row items-center justify-center gap-2">
          <CarouselPrevious
            variant={'default'}
            className="rounded-2xl"
          />
          <CarouselNext
            variant={'default'}
            className="rounded-2xl"
          />
        </div>
      </div>
    </Carousel>
  )
}
