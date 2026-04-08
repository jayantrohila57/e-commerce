import type { Route } from "next";
import Link from "next/link";
import Section from "@/shared/components/layout/section/section";
import Shell from "@/shared/components/layout/shell";
import { Button } from "@/shared/components/ui/button";
import { PATH } from "@/shared/config/routes";
import { site, siteConfig } from "@/shared/config/site";
import { buildPageMetadata } from "@/shared/seo/metadata-builders";

const pageHeading = {
  title: "Returns & exchanges",
  description: `Return and exchange guidance for ${site.name} customers.`,
};

export const metadata = buildPageMetadata({
  title: pageHeading.title,
  description: pageHeading.description,
  canonicalPath: "/support/returns",
  ogType: "website",
});

export default function Page() {
  return (
    <Shell.Section>
      <Section title={pageHeading.title} description={pageHeading.description}>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-muted-foreground">
            Summary: {siteConfig.business.returnPolicy}. Exact eligibility, timelines, and exceptions are defined in our
            policies below.
          </p>
          <ul className="text-muted-foreground space-y-2">
            <li>
              Start a return from your account order history when you&apos;re signed in, or email support with your
              order number.
            </li>
            <li>
              Read the full{" "}
              <Link className="text-primary underline-offset-4 hover:underline" href={PATH.SITE.LEGAL.RETURN as Route}>
                return policy
              </Link>{" "}
              and{" "}
              <Link className="text-primary underline-offset-4 hover:underline" href={PATH.SITE.LEGAL.REFUND as Route}>
                refund policy
              </Link>{" "}
              for complete rules.
            </li>
          </ul>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href={PATH.ACCOUNT.ORDER as Route}>View your orders</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={PATH.SITE.CONTACT as Route}>Contact support</Link>
          </Button>
        </div>
      </Section>
    </Shell.Section>
  );
}
