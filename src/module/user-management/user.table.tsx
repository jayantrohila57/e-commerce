"use client";

import { Book, PencilIcon, Tag } from "lucide-react";
import { DataTable } from "@/shared/components/table/data-table";
import { filters as tableFilters } from "@/shared/components/table/data-table-filter.config";
import { PATH } from "@/shared/config/routes";
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
      extraFilters={[
        {
          key: "role",
          title: "Role",
          options: [
            { label: "Admin", value: "ADMIN", color: "" },
            { label: "Staff", value: "STAFF", color: "" },
            { label: "Customer", value: "CUSTOMER", color: "" },
          ],
        },
        {
          key: "banned",
          title: "Banned",
          options: [
            { label: "Banned", value: "true", color: "" },
            { label: "Not banned", value: "false", color: "" },
          ],
        },
        {
          key: "emailVerified",
          title: "Email Verified",
          options: [
            { label: "Verified", value: "true", color: "" },
            { label: "Unverified", value: "false", color: "" },
          ],
        },
      ]}
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
          url: PATH.STUDIO.USERS.NEW,
        },
      }}
    />
  );
}
