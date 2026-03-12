import { getMarketingContentBlock } from "@/module/marketing-content/marketing-content.fetch";
import type { MarketingContentSelect } from "@/module/marketing-content/marketing-content.types";
import { BlurImage } from "@/shared/components/common/image";
import Section from "@/shared/components/layout/section/section";

type Page = MarketingContentSelect["page"];

interface ContentPromoBannerProps {
  page: Page;
}

export default async function ContentPromoBanner({ page }: ContentPromoBannerProps) {
  const content = await getMarketingContentBlock({
    page,
    section: "promo_banner",
  });

  if (!content) return null;

  return (
    <Section separator={false} variant="full">
      <div className="relative overflow-hidden rounded-xl bg-linear-to-r from-primary/10 via-background to-primary/5">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center lg:px-0">
          <div className="flex w-full flex-col gap-3 md:w-3/5">
            {content.title && (
              <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{content.title}</h2>
            )}
            {content.bodyText && (
              <p className="text-balance text-base text-muted-foreground sm:text-lg">{content.bodyText}</p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-3">
              {content.ctaLabel && content.ctaLink && (
                <a
                  href={content.ctaLink}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
                >
                  {content.ctaLabel}
                </a>
              )}
              {content.productLink && (
                <a
                  href={content.productLink}
                  className="inline-flex items-center justify-center rounded-md border border-input px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                >
                  View product
                </a>
              )}
            </div>
          </div>
          {content.image && (
            <div className="relative w-full md:w-2/5">
              <BlurImage
                src={content.image}
                alt={content.title ?? "Promotion"}
                width={640}
                height={400}
                className="aspect-video w-full rounded-xl object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
