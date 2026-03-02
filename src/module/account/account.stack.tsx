import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { ChevronRight, type LucideIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

type SectionItem = {
  name: string;
  description: string;
  icon: LucideIcon;
  link: Route;
};

type Category = {
  id: string;
  name: string;
  icon: LucideIcon;
  sections: SectionItem[];
};

export function ContentStack({ data }: { data: Category[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
      {data.map((category) => {
        return (
          <div key={category.id} className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {category.sections.map((section) => {
              const SectionIcon = section.icon;
              return (
                <Link href={section.link} key={section.name}>
                  <Card className="aspect-video h-full w-full">
                    <CardHeader>
                      <CardTitle>{section.name}</CardTitle>
                      <CardDescription>{section.description}</CardDescription>
                      <CardAction>
                        <SectionIcon />
                      </CardAction>
                    </CardHeader>
                    <CardFooter className="mt-auto flex items-end justify-end">
                      <ChevronRight className="h-4 w-4" />
                    </CardFooter>
                  </Card>
                </Link>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
