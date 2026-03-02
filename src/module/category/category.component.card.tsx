import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { ChevronRight, GripVertical } from "lucide-react";
import { cn, truncateString } from "@/shared/utils/lib/utils";
import Link from "next/link";
import type { Route } from "next";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { BlurImage } from "@/shared/components/ui/image";

type Category = {
  visibility: "public" | "private" | "hidden";
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
  slug: string;
  title: string;
  displayType: "grid" | "carousel" | "banner" | "list" | "featured";
  color: string | null;
  displayOrder: number;
  isFeatured: boolean;
  image?: string | null;
  description?: string | null;
  icon?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  deletedAt?: Date | null;
};

interface CategoryCardProps {
  category: Category;
  href?: string;
  className?: string;
}

export function CategoryCard({ category, href, className }: CategoryCardProps) {
  const content = (
    <div className="bg-secondary flex flex-row items-center justify-start rounded-md border p-2 shadow-xs">
      <BlurImage
        src={String(category?.image)}
        alt={category?.title}
        width={500}
        height={500}
        className="motion-all bg-secondary aspect-square h-auto w-12 rounded-full border object-cover group-hover:drop-shadow"
      />
      <Separator orientation="vertical" className="mx-4 data-[orientation=vertical]:h-8" />
      <div className="flex h-full flex-col">
        <h3 className="text-base font-semibold capitalize">{category.title}</h3>
        <p className="text-muted-foreground text-xs">{truncateString(category.description, 80)}</p>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href as Route}>{content}</Link>;
  }

  return content;
}
