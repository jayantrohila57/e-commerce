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
    <Link href={href}>
      <Card className="flex h-full group p-4 gap-0 rounded-none border-r border-b last:border-l-0 ring-0 bg-transparent flex-col justify-between hover:bg-secondary">
        <div className="overflow-hidden p-0 h-auto w-full aspect-4/5">
          <BlurImage
            src={getImageSrc(image)}
            alt={title ?? "Category"}
            width={500}
            height={500}
            className="motion-all bg-secondary scale-100 group-hover:scale-110 transition-all duration-300 h-full w-full rounded-t-sm object-cover group-hover:drop-shadow"
          />
        </div>
        <CardHeader className="border-t p-4 px-0">
          <CardTitle className="text-3xl p-0 font-semibold">{title}</CardTitle>
          <CardDescription className="text-base max-w-80 p-0 text-muted-foreground line-clamp-3">
            {description}
          </CardDescription>
          <CardAction className="flex flex-row p-4 border items-end justify-end ">
            <ArrowUpRight className="w-8 h-8 text-primary" />
          </CardAction>
        </CardHeader>
      </Card>
    </Link>
  );
}
