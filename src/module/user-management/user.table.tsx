"use client";

import { Book, PencilIcon, Tag } from "lucide-react";
import { EmptyState } from "@/shared/components/common/empty-state";
import { DataTable } from "@/shared/components/table/data-table";
import { filters as tableFilters } from "@/shared/components/table/data-table-filter.config";
import { useUserBulkActions } from "./user.bulk-actions";
import { useUserColumns } from "./user.columns";
import type { StudioManagedUserList } from "./user-management.types";

export default function UserTable({ data }: { data: StudioManagedUserList }) {
  const columns = useUserColumns();
  const bulkActions = useUserBulkActions();

  const items = data?.users ?? [];
  const total = data?.total ?? 0;
  const limit = data?.limit ?? (items.length || 20);
  const offset = data?.offset ?? 0;

  const page = limit > 0 ? Math.floor(offset / limit) + 1 : 1;
  const totalPages = limit > 0 ? Math.max(1, Math.ceil(total / limit)) : 1;

  return (
    <DataTable
      data={items}
      columns={columns}
      displayKey={"name"}
      deletionOptions={tableFilters.deletionStatus}
      bulkActions={bulkActions}
      pageCount={totalPages}
      rowCount={total}
      emptyState={{
        title: "No Users Found",
        description: "There are no users to manage yet.",
        icons: [Book, PencilIcon, Tag],
        action: {
          label: "Create Customer",
          url: "/studio/users/new",
        },
      }}
    />
  );
}
