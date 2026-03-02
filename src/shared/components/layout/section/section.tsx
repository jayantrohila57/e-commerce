import { cn } from "@/shared/utils/lib/utils";
import { Button } from "../../ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/card";
import { Separator } from "../../ui/separator";
import Link from "next/link";
import type { Route } from "next";

interface SectionProps {
  title?: string;
  description?: string;
  action?: string;
  children: React.ReactNode;
  separator?: boolean;
  variant?: "default" | "full";
  className?: string;
  actionLink?: Route;
}

export default function Section({
  variant,
  title,
  description,
  action,
  children,
  separator = true,
  className,
  actionLink,
}: SectionProps) {
  return (
    <Card className={cn("bg-card/0 gap-0 border-none p-0 shadow-none", className)}>
      {title && description && (
        <div className={variant === "full" ? "w-full" : "max-w-9xl container mx-auto mb-4"}>
          <CardHeader className="px-0">
            {title && <CardTitle className="text-4xl">{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
            <CardAction>
              {action && actionLink && (
                <Link href={actionLink}>
                  <Button variant={"outline"}>{action}</Button>
                </Link>
              )}
            </CardAction>
          </CardHeader>
        </div>
      )}
      {separator && <Separator className="mb-4" />}
      <CardContent className="min-h-[600px] p-0">{children}</CardContent>
    </Card>
  );
}
