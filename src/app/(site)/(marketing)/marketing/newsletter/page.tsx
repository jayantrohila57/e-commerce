import { NewsletterSignupForm } from "@/module/newsletter/newsletter-signup-form";
import {
  ContentAnnouncementBar,
  ContentCTA,
  ContentFeatureHighlights,
  ContentOfferBanner,
  ContentPromoBanner,
  ContentSplitBanner,
} from "@/module/site/content-sections";
import Section from "@/shared/components/layout/section/section";
import Shell from "@/shared/components/layout/shell";
import { site, siteConfig } from "@/shared/config/site";
import { buildPageMetadata } from "@/shared/seo/metadata-builders";

const pageHeading = {
  title: "Newsletter",
  description: `Subscribe to ${site.name} for updates and offers.`,
};

export const metadata = buildPageMetadata({
  title: pageHeading.title,
  description: pageHeading.description,
  canonicalPath: "/marketing/newsletter",
  ogType: "website",
});

export default function Page() {
  return (
    <Shell>
      <Shell.Section>
        <ContentAnnouncementBar page="newsletter" />
      </Shell.Section>
      <Shell.Section>
        <ContentPromoBanner page="newsletter" />
      </Shell.Section>
      <Shell.Section>
        <ContentSplitBanner page="newsletter" />
      </Shell.Section>
      <Shell.Section>
        <Section title={pageHeading.title} description={pageHeading.description}>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm leading-relaxed">
                Get product drops, restocks, and occasional offers. You can unsubscribe anytime from emails we send.
              </p>
              <NewsletterSignupForm source="newsletter_page" submitLabel="Subscribe" className="max-w-md space-y-2" />
            </div>
            <ul className="text-muted-foreground list-inside list-disc space-y-2 text-sm">
              <li>We use {siteConfig.contact.supportEmail} for subscriber service and questions.</li>
              <li>Marketing emails respect the choices in your account and applicable unsubscribe links.</li>
              <li>Privacy details: see our published privacy policy linked from the site footer.</li>
            </ul>
          </div>
        </Section>
      </Shell.Section>
      <Shell.Section>
        <ContentCTA page="newsletter" />
      </Shell.Section>
      <Shell.Section>
        <ContentOfferBanner page="newsletter" />
      </Shell.Section>
      <Shell.Section>
        <ContentFeatureHighlights page="newsletter" />
      </Shell.Section>
    </Shell>
  );
}
