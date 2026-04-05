"use client";

import Autoplay from "embla-carousel-autoplay";
import { ChevronRightCircle, SquareIcon, Squircle } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import * as React from "react";
import { BlurImage } from "@/shared/components/common/image";
import { Button } from "@/shared/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/components/ui/carousel";
import { getImageSrc } from "@/shared/utils/lib/image.utils";
import { cn } from "@/shared/utils/lib/utils";
import type { MarketingContentSelect } from "../marketing-content/marketing-content.types";

type CarouselItem = NonNullable<MarketingContentSelect["items"]>[number];

export function MarketingCarousel({ items }: { items: CarouselItem[] | null | undefined }) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const autoplay = React.useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
      stopOnFocusIn: true,
      stopOnLastSnap: true,
    }),
  );

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => setCurrent(api.selectedScrollSnap() + 1));
  }, [api]);

  const slides = items ?? [];
  if (slides.length === 0) return null;

  return (
    <Carousel
      className="w-full"
      opts={{ loop: true, align: "start", dragFree: false }}
      plugins={[autoplay.current]}
      setApi={setApi}
    >
      <div>
        <CarouselContent className="">
          {slides.map((item, i) => {
            const title = item.title ?? "Banner";
            const href = item.ctaLink ?? undefined;
            return (
              <CarouselItem key={i}>
                <div className="bg-transparent h-full w-full  group grid grid-cols-12 text-balance p-0">
                  <div className="flex h-auto hover:cursor-grab active:cursor-grabbing p-0 col-span-9 aspect-video w-full items-center justify-center overflow-hidden">
                    <BlurImage
                      src={getImageSrc(item.image)}
                      alt={title}
                      width={1920}
                      height={1080}
                      className="motion-all h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-8 col-span-3 bg-secondary flex flex-col gap-8 justify-center items-start">
                    <h2 className="text-6xl font-semibold">{title}</h2>
                    <p className="text-base text-muted-foreground">{item.bodyText ?? ""}</p>
                    <Button variant="default" size={"lg"} asChild>
                      <Link href={href as Route}>{item.ctaLabel ?? "View more"}</Link>
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </div>
      <div className="flex w-full border-y h-16 flex-row items-center justify-between">
        <div className="flex h-full w-full items-center justify-start">
          {slides.map((_, i) => (
            <div
              key={i}
              onClick={() => api?.scrollTo(i)}
              className="size-16 cursor-pointer hover:bg-secondary flex items-center justify-center border-r"
            >
              <SquareIcon
                className={cn(
                  "h-4 w-4 stroke-2",
                  i === current - 1 ? "text-primary fill-primary" : "text-muted-foreground",
                )}
              />
            </div>
          ))}
        </div>
        <div className="flex relative h-full w-full items-center justify-end">
          <div className="size-16 cursor-pointer hover:bg-secondary flex items-center justify-center border-l">
            <CarouselPrevious variant={"ghost"} className="relative cursor-pointer rounded-none" />
          </div>
          <div className="size-16 cursor-pointer hover:bg-secondary flex items-center justify-center border-l">
            <CarouselNext variant={"ghost"} className="relative cursor-pointer rounded-none" />
          </div>
        </div>
      </div>
    </Carousel>
  );
}
