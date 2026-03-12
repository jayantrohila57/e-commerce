"use client";

import { Book, Megaphone, Tag } from "lucide-react";
import { DataTable } from "@/shared/components/table/data-table";
import { filters as tableFilters } from "@/shared/components/table/data-table-filter.config";
import { PATH } from "@/shared/config/routes";
import { useMarketingContentColumns } from "./marketing-content.columns";
import type { GetManyMarketingContentOutput } from "./marketing-content.types";

export default function MarketingContentTable({ data }: { data: GetManyMarketingContentOutput }) {
  const columns = useMarketingContentColumns();

  const items = data?.data ?? [];
  const pageCount = data?.meta?.pagination?.totalPages;
  const rowCount = data?.meta?.pagination?.total;

  return (
    <DataTable
      data={items}
      columns={columns}
      displayKey={"title"}
      deletionOptions={tableFilters.deletionStatus}
      pageCount={pageCount}
      rowCount={rowCount}
      emptyState={{
        title: "No Marketing Content Found",
        description:
          "You don't have any marketing content blocks yet. Create promo banners, CTAs, and more to highlight offers.",
        icons: [Book, Megaphone, Tag],
        action: {
          label: "Create Marketing Content",
          url: PATH.STUDIO.MARKETING.CONTENT.NEW,
        },
      }}
    />
  );
}
