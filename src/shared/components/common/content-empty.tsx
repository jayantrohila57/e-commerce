import type { LucideIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/lib/utils";

export type ContentEmptyAction = {
  label: string;
  href: Route | string;
};

export interface ContentEmptyProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  className?: string;
  primaryAction?: ContentEmptyAction;
  secondaryAction?: ContentEmptyAction;
}

/**
 * Inline empty state for pages and sections when a list has no data (storefront, account, etc.).
 */
export function ContentEmpty({
  icon: Icon,
  title,
  description,
  className,
  primaryAction,
  secondaryAction,
}: ContentEmptyProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/40 px-6 py-10 text-center",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      {Icon ? (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-sm">
          <Icon className="h-6 w-6 text-muted-foreground" aria-hidden />
        </div>
      ) : null}
      <h3 className="mb-1 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mb-4 max-w-md text-sm text-muted-foreground">{description}</p>
      {(primaryAction ?? secondaryAction) ? (
        <div className="flex flex-wrap justify-center gap-2">
          {primaryAction ? (
            <Button asChild size="sm">
              <Link href={primaryAction.href as Route}>{primaryAction.label}</Link>
            </Button>
          ) : null}
          {secondaryAction ? (
            <Button asChild variant="outline" size="sm">
              <Link href={secondaryAction.href as Route}>{secondaryAction.label}</Link>
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
