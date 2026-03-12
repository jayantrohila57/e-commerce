import type { Route } from "next";
import Link from "next/link";
import { cn } from "@/shared/utils/lib/utils";
import { Button } from "../../ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/card";
import { Separator } from "../../ui/separator";

interface SectionProps {
  title?: string;
  description?: string;
  action?: string;
  children: React.ReactNode;
  separator?: boolean;
  variant?: "default" | "full";
  className?: string;
  actionLink?: Route;
  isMinHeight?: boolean;
}

export default function Section({
  variant,
  title,
  description,
  action,
  children,
  separator = true,
  isMinHeight = true,
  className,
  actionLink,
}: SectionProps) {
  return (
    <Card className={cn("bg-card/0 ring-0 gap-0 border-none p-0 shadow-none", className)}>
      {title && description && (
        <div className="w-full p-4 border-y">
          <CardHeader className="px-4">
            {title && <CardTitle className="text-6xl font-semibold">{title}</CardTitle>}
            {description && (
              <CardDescription className="text-base text-muted-foreground">{description}</CardDescription>
            )}
            <CardAction className="flex flex-row items-end justify-end mt-6">
              {action && actionLink && (
                <Link href={actionLink}>
                  <Button>{action}</Button>
                </Link>
              )}
            </CardAction>
          </CardHeader>
        </div>
      )}
      <div className="w-full h-16 border-b"></div>
      <CardContent className={cn("p-0", isMinHeight && "min-h-[600px]")}>{children}</CardContent>
    </Card>
  );
}
