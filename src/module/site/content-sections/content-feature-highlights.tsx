import { getMarketingContentBlocks } from "@/module/marketing-content/marketing-content.fetch";
import type { MarketingContentSelect } from "@/module/marketing-content/marketing-content.types";
import Section from "@/shared/components/layout/section/section";

type Page = MarketingContentSelect["page"];

interface ContentFeatureHighlightsProps {
  page: Page;
  sectionTitle?: string;
  sectionDescription?: string;
}

export default async function ContentFeatureHighlights({
  page,
  sectionTitle = "Why shop with us",
  sectionDescription = "Key benefits your customers get when buying from your store.",
}: ContentFeatureHighlightsProps) {
  const blocks = await getMarketingContentBlocks({
    page,
    section: "feature_highlight",
    limit: 6,
  });

  if (!blocks.length) return null;

  return (
    <Section title={sectionTitle} description={sectionDescription}>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blocks.map((block) => (
          <div key={block.id} className="flex h-full flex-col gap-2 rounded-xl border bg-card/40 p-4 shadow-xs">
            <h3 className="text-sm font-semibold sm:text-base">{block.title ?? "Feature"}</h3>
            {block.bodyText && <p className="text-xs text-muted-foreground sm:text-sm">{block.bodyText}</p>}
            {block.ctaLabel && block.ctaLink && (
              <a
                href={block.ctaLink}
                className="mt-2 text-xs font-medium text-primary underline underline-offset-4 sm:text-sm"
              >
                {block.ctaLabel}
              </a>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}
