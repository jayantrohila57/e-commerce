import { apiServer } from "@/core/api/api.server";
import type { MarketingContentSelect } from "./marketing-content.types";

type Page = MarketingContentSelect["page"];
type Section = MarketingContentSelect["section"];

interface GetContentOptions {
  page: Page;
  section: Section;
  limit?: number;
  isActive?: boolean;
}

export async function getMarketingContentBlock({
  page,
  section,
  limit = 1,
  isActive = true,
}: GetContentOptions): Promise<MarketingContentSelect | null> {
  const { data } = await apiServer.marketingContent.getManyPublic({
    query: {
      page,
      section,
      isActive,
      offset: 0,
      limit,
    },
  });

  if (!data || data.length === 0) return null;
  return data[0] ?? null;
}

export async function getMarketingContentBlocks({
  page,
  section,
  limit = 6,
  isActive = true,
}: GetContentOptions): Promise<MarketingContentSelect[]> {
  const { data } = await apiServer.marketingContent.getManyPublic({
    query: {
      page,
      section,
      isActive,
      offset: 0,
      limit,
    },
  });

  return data ?? [];
}
