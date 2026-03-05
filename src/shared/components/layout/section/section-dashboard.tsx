import type { Route } from "next";
import Link from "next/link";
import { slugToTitle } from "@/shared/utils/lib/url.utils";
import { Button } from "../../ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";

interface SectionProps<T extends string = string> {
  title?: string;
  description?: string;
  action?: string;
  actionUrl?: T;
  children: React.ReactNode;
}

export default function DashboardSection({ title, description, action, actionUrl, children }: SectionProps<Route>) {
  return (
    <Card className="bg-card motion-all h-full w-full gap-0 rounded-md p-0 shadow-none">
      {title && description && (
        <CardHeader className="flex flex-row items-center justify-between p-3">
          <div className="flex h-full w-full flex-row items-center justify-end gap-2">
            <div className="h-full w-full">
              {title && <CardTitle className="text-2xl">{slugToTitle(title)}</CardTitle>}
              {description && <CardDescription className="">{description}</CardDescription>}
            </div>
            <CardAction>
              {action && (
                <Button variant={"default"} asChild={actionUrl ? true : false}>
                  {actionUrl && <Link href={actionUrl}>{action}</Link>}
                </Button>
              )}
            </CardAction>
          </div>
        </CardHeader>
      )}
      <div className="motion-all p-2 pt-0">
        <CardContent className="bg-secondary motion-all h-[calc(100vh-9.4rem)] overflow-auto rounded-md border p-2 pb-20">
          {children}
        </CardContent>
      </div>
    </Card>
  );
}
