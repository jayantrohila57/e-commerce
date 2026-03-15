import { getMarketingContentBlock } from "@/module/marketing-content/marketing-content.fetch";
import type { MarketingContentSelect } from "@/module/marketing-content/marketing-content.types";
import { BlurImage } from "@/shared/components/common/image";
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
    <Section separator={false} variant="full">
      <div className="relative overflow-hidden mb-16 border-y aspect-21/9 bg-secondary">
        {/* IMAGE */}
        <div className="absolute inset-0">
          <BlurImage
            src={content.image ?? undefined}
            alt={content.title ?? "Offer banner"}
            width={1600}
            height={900}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-l from-muted/50 to-transparent" />
        </div>

        <div className="relative z-10 flex h-full items-center justify-end w-full px-6 py-12 md:px-12 lg:px-16">
          <div className="max-w-3xl flex flex-col items-center justify-center ml-auto space-y-5 text-primary">
            {content.title && (
              <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">{content.title}</h2>
            )}
            {content.bodyText && <p className="text-base text-muted-foreground sm:text-lg">{content.bodyText}</p>}
            <div className="flex flex-wrap gap-3 pt-2">
              {content.ctaLabel && content.ctaLink && (
                <a
                  href={content.ctaLink}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  {content.ctaLabel}
                </a>
              )}

              {content.productLink && (
                <a
                  href={content.productLink}
                  className="inline-flex items-center justify-center rounded-md border border-input px-6 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
                >
                  View product
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
