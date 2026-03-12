import { getMarketingContentBlock } from "@/module/marketing-content/marketing-content.fetch";
import type { MarketingContentSelect } from "@/module/marketing-content/marketing-content.types";
import Section from "@/shared/components/layout/section/section";

type Page = MarketingContentSelect["page"];

interface ContentAnnouncementBarProps {
  page: Page;
}

export default async function ContentAnnouncementBar({ page }: ContentAnnouncementBarProps) {
  const content = await getMarketingContentBlock({
    page,
    section: "announcement_bar",
  });

  if (!content) return null;

  return (
    <Section separator={false} variant="full">
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm">
          <span className="font-medium">{content.title ?? "Announcement"}</span>
          {content.bodyText && <span className="opacity-90">{content.bodyText}</span>}
          {content.ctaLabel && content.ctaLink && (
            <a href={content.ctaLink} className="ml-3 underline underline-offset-4">
              {content.ctaLabel}
            </a>
          )}
        </div>
      </div>
    </Section>
  );
}
