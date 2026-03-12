import { getMarketingContentBlock } from "@/module/marketing-content/marketing-content.fetch";
import type { MarketingContentSelect } from "@/module/marketing-content/marketing-content.types";
import Section from "@/shared/components/layout/section/section";

type Page = MarketingContentSelect["page"];

interface ContentOfferBannerProps {
  page: Page;
}

export default async function ContentOfferBanner({ page }: ContentOfferBannerProps) {
  const content = await getMarketingContentBlock({
    page,
    section: "offer_banner",
  });

  if (!content) return null;

  return (
    <Section separator={false}>
      <div className="flex flex-col items-center justify-between gap-3 rounded-xl bg-amber-50 px-4 py-4 text-center text-amber-900 ring-1 ring-amber-200 sm:flex-row sm:text-left">
        <div className="space-y-1">
          {content.title && <p className="text-sm font-semibold uppercase tracking-wide">{content.title}</p>}
          {content.bodyText && <p className="text-sm sm:text-base">{content.bodyText}</p>}
        </div>
        {content.ctaLabel && content.ctaLink && (
          <a
            href={content.ctaLink}
            className="inline-flex items-center justify-center rounded-md bg-amber-900 px-4 py-2 text-xs font-medium text-amber-50 shadow-sm transition hover:bg-amber-800 sm:text-sm"
          >
            {content.ctaLabel}
          </a>
        )}
      </div>
    </Section>
  );
}
