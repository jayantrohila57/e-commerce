import type { Route } from "next";
import Link from "next/link";
import { SupportQuickLinkGrid } from "@/module/site/support-hub";
import Section from "@/shared/components/layout/section/section";
import Shell from "@/shared/components/layout/shell";
import { Button } from "@/shared/components/ui/button";
import { PATH } from "@/shared/config/routes";
import { site } from "@/shared/config/site";
import { buildPageMetadata } from "@/shared/seo/metadata-builders";

const pageHeading = {
  title: "Help center",
  description: `Browse topics and policies for shopping with ${site.name}.`,
};

export const metadata = buildPageMetadata({
  title: pageHeading.title,
  description: pageHeading.description,
  canonicalPath: "/support/help-center",
  ogType: "website",
});

export default function Page() {
  return (
    <Shell.Section>
      <Section title={pageHeading.title} description={pageHeading.description}>
        <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
          Start with common tasks below. For legal wording, open the full policy pages — they’re always the source of
          truth.
        </p>
        <SupportQuickLinkGrid />
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href={PATH.SITE.LEGAL.PRIVACY as Route}>Privacy policy</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={PATH.SITE.LEGAL.TERMS as Route}>Terms of service</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={PATH.SITE.LEGAL.ROOT as Route}>All legal policies</Link>
          </Button>
        </div>
      </Section>
    </Shell.Section>
  );
}
