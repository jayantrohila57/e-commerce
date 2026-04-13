import type { Route } from "next";
import Link from "next/link";
import Section from "@/shared/components/layout/section/section";
import { Button } from "@/shared/components/ui/button";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "Not Found",
  description: "The page you are looking for does not exist or has been moved.",
};

export default function NotFound() {
  return (
    <Section {...metadata}>
      <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Not found</h1>
        <p className="text-muted-foreground max-w-md text-sm">
          The page you are looking for does not exist or may have been moved.
        </p>
        <Button asChild>
          <Link href={PATH.STORE.ROOT as Route}>Back to store</Link>
        </Button>
      </div>
    </Section>
  );
}
