import type { Route } from "next";
import Link from "next/link";
import Section from "@/shared/components/layout/section/section";
import Shell from "@/shared/components/layout/shell";
import { Button } from "@/shared/components/ui/button";
import { PATH } from "@/shared/config/routes";
import { site, siteConfig } from "@/shared/config/site";
import { buildPageMetadata } from "@/shared/seo/metadata-builders";

const pageHeading = {
  title: "Shipping information",
  description: `Shipping options and delivery details for ${site.name} orders.`,
};

export const metadata = buildPageMetadata({
  title: pageHeading.title,
  description: pageHeading.description,
  canonicalPath: "/support/shipping",
  ogType: "website",
});

export default function Page() {
  const threshold = siteConfig.business.freeShippingThreshold;
  return (
    <Shell.Section>
      <Section title={pageHeading.title} description={pageHeading.description}>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ul className="text-muted-foreground space-y-2">
            <li>
              Costs and delivery windows are calculated at checkout based on your address and the shipping method you
              choose.
            </li>
            {threshold ? (
              <li>
                Free shipping may apply on qualifying orders over {siteConfig.business.freeShippingThreshold} (where
                offered — see cart and checkout for your order).
              </li>
            ) : null}
            <li>You’ll get tracking details by email when your order ships when a carrier provides tracking.</li>
            <li>
              Full legal terms for shipping and delivery are in our{" "}
              <Link
                className="text-primary underline-offset-4 hover:underline"
                href={PATH.SITE.LEGAL.SHIPPING as Route}
              >
                shipping policy
              </Link>
              .
            </li>
          </ul>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href={PATH.STORE.ROOT as Route}>Continue shopping</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={PATH.SITE.CONTACT as Route}>Contact support</Link>
          </Button>
        </div>
      </Section>
    </Shell.Section>
  );
}
