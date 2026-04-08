import type { Route } from "next";
import Link from "next/link";
import { supportContactSummary } from "@/module/site/support-content";
import { SupportContactPanel } from "@/module/site/support-hub";
import Section from "@/shared/components/layout/section/section";
import Shell from "@/shared/components/layout/shell";
import { Button } from "@/shared/components/ui/button";
import { PATH } from "@/shared/config/routes";
import { site } from "@/shared/config/site";
import { buildPageMetadata } from "@/shared/seo/metadata-builders";

const pageHeading = {
  title: "Contact support",
  description: `Get in touch with ${site.name} to ask a question or get help with your order.`,
};

export const metadata = buildPageMetadata({
  title: pageHeading.title,
  description: pageHeading.description,
  canonicalPath: "/support/contact",
  ogType: "website",
});

export default function Page() {
  const { email } = supportContactSummary();
  return (
    <Shell.Section>
      <Section title={pageHeading.title} description={pageHeading.description}>
        <SupportContactPanel />
        <div className="mt-8 flex flex-col gap-4 rounded-xl border border-border bg-muted/20 p-6">
          <p className="text-muted-foreground text-sm leading-relaxed">
            For the fastest help, include your order number (if applicable) and a short description of the issue. We
            reply by email as soon as we can.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <a href={`mailto:${email}?subject=${encodeURIComponent(`${site.name} — support request`)}`}>
                Email support
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link href={PATH.SITE.SUPPORT.FAQ as Route}>Browse FAQs</Link>
            </Button>
          </div>
        </div>
      </Section>
    </Shell.Section>
  );
}
