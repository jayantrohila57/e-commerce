"use client";

import { Eye, Sparkles } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { cn } from "@/shared/utils/lib/utils";

type Category = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  color: string;
  visibility: "public" | "private" | "hidden";
  displayType: string;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
};

export function CategoryViewCard({ data }: { data: Category }) {
  return (
    <Card className={cn()}>
      <div className="relative w-full overflow-hidden">
        {data.isFeatured && (
          <Badge
            className="absolute top-2 left-2 flex items-center gap-1 bg-yellow-400 font-medium text-black"
            variant="secondary"
          >
            <Sparkles size={14} />
            Featured
          </Badge>
        )}
      </div>

      <CardHeader className="px-4 pt-4 pb-0">
        <h3 className="text-lg leading-tight font-semibold">{data.title}</h3>
        <p className="text-muted-foreground line-clamp-2 text-sm">{data.description}</p>
      </CardHeader>

      <CardContent className="flex items-center justify-between px-4 py-4">
        <Badge variant="outline" className="text-xs capitalize" style={{ borderColor: data.color }}>
          {data.displayType}
        </Badge>
        <div className="text-muted-foreground flex items-center gap-1 text-sm">
          <Eye size={14} />
          {data.visibility}
        </div>
      </CardContent>
    </Card>
  );
}
