import { getMarketingContentBlock } from "@/module/marketing-content/marketing-content.fetch";
import type { MarketingContentSelect } from "@/module/marketing-content/marketing-content.types";
import ContentAnnouncementBarClient from "./content-announcement-bar-client";

type Page = MarketingContentSelect["page"];

interface ContentAnnouncementBarProps {
  page: Page;
}

export default async function ContentAnnouncementBar({ page }: ContentAnnouncementBarProps) {
  const data = await getMarketingContentBlock({
    page,
    section: "announcement_bar",
  });
  const content = {
    id: data?.id ?? "1",
    title: data?.title ?? "Welcome to our website",
    bodyText:
      data?.bodyText ??
      "We are a team of developers who are passionate about creating beautiful and functional websites.",
    ctaLabel: data?.ctaLabel ?? "Visit our website",
    ctaLink: data?.ctaLink ?? "/",
  };

  if (!data) return null;
  return <ContentAnnouncementBarClient content={content} />;
}
