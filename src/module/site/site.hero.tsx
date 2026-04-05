import Section from "@/shared/components/layout/section/section";
import { getMarketingContentBlock } from "../marketing-content/marketing-content.fetch";
import { MarketingCarousel } from "./site.carousel";

export default async function SiteHero() {
  const content = await getMarketingContentBlock({
    page: "home",
    section: "crousel",
    limit: 1,
  });
  return (
    <Section>
      <MarketingCarousel items={content?.items ?? []} />
    </Section>
  );
}
