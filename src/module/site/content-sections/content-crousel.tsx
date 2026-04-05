import { getMarketingContentBlock } from "@/module/marketing-content/marketing-content.fetch";
import type { MarketingContentSelect } from "@/module/marketing-content/marketing-content.types";
import Section from "@/shared/components/layout/section/section";
import { MarketingCrousel } from "../site.crousel";

type Page = MarketingContentSelect["page"];

interface ContentCrouselProps {
  page: Page;
}

export default async function ContentCrousel({ page }: ContentCrouselProps) {
  const content = await getMarketingContentBlock({
    page,
    section: "crousel",
    limit: 1,
  });

  const items = content?.items ?? [];
  if (!items.length) return null;

  return (
    <Section>
      <MarketingCrousel items={items} />
    </Section>
  );
}
