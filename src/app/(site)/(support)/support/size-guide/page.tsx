import type { Route } from "next";
import Link from "next/link";
import Section from "@/shared/components/layout/section/section";
import Shell from "@/shared/components/layout/shell";
import { Button } from "@/shared/components/ui/button";
import { PATH } from "@/shared/config/routes";
import { site } from "@/shared/config/site";
import { buildPageMetadata } from "@/shared/seo/metadata-builders";

const pageHeading = {
  title: "Size guide",
  description: `How to choose the right fit when you shop ${site.name}.`,
};

export const metadata = buildPageMetadata({
  title: pageHeading.title,
  description: pageHeading.description,
  canonicalPath: "/support/size-guide",
  ogType: "website",
});

export default function Page() {
  return (
    <Shell.Section>
      <Section title={pageHeading.title} description={pageHeading.description}>
        <div className="prose prose-sm dark:prose-invert max-w-none space-y-4">
          <p className="text-muted-foreground">
            Product pages list the measurements that matter for that item (for example chest, waist, inseam, or numeric
            size). Use a soft tape measure and keep it level — don&apos;t pull tight.
          </p>
          <ul className="text-muted-foreground space-y-2">
            <li>
              <strong className="text-foreground">Chest / bust:</strong> around the fullest part, under the arms.
            </li>
            <li>
              <strong className="text-foreground">Waist:</strong> natural waistline, usually the narrowest part.
            </li>
            <li>
              <strong className="text-foreground">Hips:</strong> fullest part of the hips, feet together.
            </li>
            <li>
              <strong className="text-foreground">Between sizes?</strong> Check the product&apos;s fit notes on the
              detail page; when in doubt, contact us before ordering.
            </li>
          </ul>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href={PATH.STORE.ROOT as Route}>Shop</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={PATH.SITE.CONTACT as Route}>Ask about sizing</Link>
          </Button>
        </div>
      </Section>
    </Shell.Section>
  );
}
