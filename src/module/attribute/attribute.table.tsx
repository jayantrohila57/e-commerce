"use client";

import { Book, PencilIcon, Tag } from "lucide-react";
import { DataTable } from "@/shared/components/table/data-table";
import { filters as tableFilters } from "@/shared/components/table/data-table-filter.config";
import type { FilterOption } from "@/shared/config/options.config";
import { PATH } from "@/shared/config/routes";
import { useAttributeBulkActions } from "./attribute.bulk-actions";
import { useAttributeColumns } from "./attribute.columns";
import type { GetManyAttributesOutput } from "./attribute.types";

export default function AttributeTable({ data }: { data: GetManyAttributesOutput }) {
  const columns = useAttributeColumns();
  const bulkActions = useAttributeBulkActions();

  const items = data?.data ?? [];
  const pageCount = data?.meta?.pagination?.totalPages;
  const rowCount = data?.meta?.pagination?.total;

  return (
    <DataTable
      data={items}
      columns={columns}
      displayKey={"title"}
      extraFilters={[
        {
          key: "type",
          title: "Type",
          options: Array.from(new Set(items.map((item) => item.type))).map((t) => ({
            label: t,
            value: t,
            color: "",
          })),
        },
        {
          key: "hasValues",
          title: "Has Values",
          options: [
            { label: "Yes", value: "true", color: "" },
            { label: "No", value: "false", color: "" },
          ],
        },
      ]}
      deletionOptions={tableFilters.deletionStatus}
      bulkActions={bulkActions}
      pageCount={pageCount}
      rowCount={rowCount}
      emptyState={{
        title: "No Attributes Found",
        description: "You don't have any attributes yet.",
        icons: [Book, PencilIcon, Tag],
        action: {
          label: "Create Attribute",
          url: PATH.STUDIO.ATTRIBUTES.NEW,
        },
      }}
    />
  );
}
