import { getMarketingContentBlock } from "@/module/marketing-content/marketing-content.fetch";
import type { MarketingContentSelect } from "@/module/marketing-content/marketing-content.types";
import Section from "@/shared/components/layout/section/section";

type Page = MarketingContentSelect["page"];

interface ContentCTAProps {
  page: Page;
}

export default async function ContentCTA({ page }: ContentCTAProps) {
  const content = await getMarketingContentBlock({
    page,
    section: "cta",
  });

  if (!content) return null;

  return (
    <Section separator={false}>
      <div className="  flex h-full w-full  flex-col items-center gap-4   bg-card px-6 py-20 text-center">
        {content.title && (
          <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">{content.title}</h2>
        )}
        {content.bodyText && (
          <p className="max-w-2xl text-balance text-sm text-muted-foreground sm:text-base">{content.bodyText}</p>
        )}
        {content.ctaLabel && content.ctaLink && (
          <a
            href={content.ctaLink}
            className="mt-2 inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            {content.ctaLabel}
          </a>
        )}
      </div>
    </Section>
  );
}
