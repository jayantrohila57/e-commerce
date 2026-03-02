import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { cn } from "@/shared/utils/lib/utils";
import { ChevronRight, GripVertical } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { GetManySeriesOutput } from "./series.types";

interface SeriesCardProps {
  data: NonNullable<GetManySeriesOutput["data"]>[number];
  href?: string;
  className?: string;
}

export function SeriesCard({ data, href, className }: SeriesCardProps) {
  const getStatusBadge = () => {
    if (data?.deletedAt) {
      return <Badge variant="destructive">Deleted</Badge>;
    }
    if (!data?.isFeatured) {
      return null;
    }
    return <Badge variant="secondary">Featured</Badge>;
  };

  const content = (
    <div
      className={cn(
        "group bg-secondary hover:bg-secondary/80 flex flex-row items-center justify-between rounded-md border p-2 shadow-xs transition-colors",
        className,
      )}
    >
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="cursor-grab active:cursor-grabbing">
          <GripVertical className="text-muted-foreground h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-8" />
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{data?.title}</h3>
            {getStatusBadge()}
          </div>
          {data?.description && <p className="text-muted-foreground line-clamp-1 text-xs">{data?.description}</p>}
        </div>
      </div>
      <ChevronRight className="text-muted-foreground h-4 w-4 transition-transform group-hover:translate-x-1" />
    </div>
  );

  if (href) {
    return (
      <Link href={href as Route} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
