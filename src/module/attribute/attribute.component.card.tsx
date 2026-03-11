import { ChevronRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { PATH } from "@/shared/config/routes";
import type { AttributeSelect } from "./attribute.schema";

export function AttributeCard({ attribute }: { attribute: AttributeSelect }) {
  return (
    <Link href={PATH.STUDIO.ATTRIBUTES.EDIT(attribute.slug, attribute.id) as Route}>
      <div className="bg-secondary hover:bg-secondary/80 motion-all flex w-full items-center justify-between gap-3 rounded-md border p-2 shadow-xs">
        <div className="flex min-w-0 items-center gap-3">
          <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
            {String(attribute.title)?.slice(0, 2)?.toUpperCase()}
          </div>
          <Separator orientation="vertical" className="data-[orientation=vertical]:h-8" />
          <div className="flex min-w-0 flex-col">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-base font-semibold">{attribute.title}</h3>
              <Badge variant="secondary" className="shrink-0">
                {attribute.type}
              </Badge>
            </div>
            <p className="text-muted-foreground truncate text-xs">
              <span className="font-mono">{attribute.slug}</span>
              {" · "}
              <span className="font-mono">{attribute.value}</span>
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Badge variant="outline" className="hidden sm:inline-flex">
            Order: {attribute.displayOrder ?? 0}
          </Badge>
          <ChevronRight className="text-muted-foreground h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}

export default AttributeCard;
