import { ArrowUpRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { BlurImage } from "@/shared/components/common/image";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { getImageSrc } from "@/shared/utils/lib/image.utils";

export interface CategoryCardProps {
  id: string;
  href: Route;
  title: string;
  description?: string | null;
  image?: string | null;
}

export default function CategoryCard({ id, href, title, description, image }: CategoryCardProps) {
  return (
    <Link href={href} className="min-w-0">
      <Card className="flex h-full min-w-0 flex-col justify-between gap-0 rounded-xl border border-border bg-background p-3 ring-0 hover:bg-secondary group sm:rounded-none sm:border-0 sm:border-b sm:border-r sm:bg-transparent sm:p-4">
        <div className="aspect-4/5 h-auto w-full overflow-hidden p-0">
          <BlurImage
            src={getImageSrc(image)}
            alt={title ?? "Category"}
            width={500}
            height={500}
            className="motion-all h-full w-full scale-100 rounded-t-sm bg-secondary object-cover transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow"
          />
        </div>
        <CardHeader className="border-t p-0 px-0 pt-3 sm:pt-4">
          <CardTitle className="p-0 text-xl font-semibold sm:text-2xl md:text-3xl">{title}</CardTitle>
          <CardDescription className="max-w-80 p-0 text-sm text-muted-foreground line-clamp-3 sm:text-base">
            {description}
          </CardDescription>
          <CardAction className="flex flex-row items-end justify-end border-t p-2 pt-3 sm:p-4">
            <ArrowUpRight className="size-6 shrink-0 text-primary sm:size-8" aria-hidden />
          </CardAction>
        </CardHeader>
      </Card>
    </Link>
  );
}
