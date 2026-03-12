"use client";

import type { Row } from "@tanstack/react-table";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";
import { apiClient } from "@/core/api/api.client";
import { DataTableColumnHeader } from "@/shared/components/table/data-table-column-header";
import { commonColumns } from "@/shared/components/table/data-table-columns";
import { STATUS } from "@/shared/config/api.config";
import { marketingContentTableConfig } from "./marketing-content.table.config";
import type { MarketingContentBase } from "./marketing-content.types";

export function useMarketingContentColumns() {
  const router = useRouter();
  const utils = apiClient.useUtils();

  const deleteContent = apiClient.marketingContent.delete.useMutation({
    onSuccess: async ({ status, message }) => {
      if (status === STATUS.SUCCESS) {
        toast.success(message);
        await utils.marketingContent.getMany.invalidate();
      } else {
        toast.error(message);
      }
    },
    onError: (err) => toast.error(err.message),
  });

  return useMemo(() => {
    const handleEdit = (row: Row<MarketingContentBase>) => {
      const id = row.getValue(marketingContentTableConfig.fields.id);
      if (id && typeof id === "string") {
        router.push(marketingContentTableConfig.routes.edit(id) as Route);
      }
    };

    const handleView = (row: Row<MarketingContentBase>) => {
      const original = row.original;
      const title = original.title ?? "Untitled";
      const page = original.page ?? "N/A";
      const section = original.section ?? "N/A";
      toast.info(`"${title}" on ${page} · ${section}`);
    };

    const handleDelete = (row: Row<MarketingContentBase>) => {
      const id = row.getValue(marketingContentTableConfig.fields.id);
      const title = String(row.getValue(marketingContentTableConfig.fields.title) ?? "this content block");
      if (id && typeof id === "string") {
        if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
          deleteContent.mutate({ params: { id } });
        }
      }
    };

    return [
      ...commonColumns.selectColumn<MarketingContentBase>(),
      {
        accessorKey: marketingContentTableConfig.fields.title,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
        cell: ({ row }: { row: Row<MarketingContentBase> }) => {
          const original = row.original;
          const title = original.title ?? "Untitled";
          const page = original.page ?? "N/A";
          const section = original.section ?? "N/A";
          return (
            <div className="flex min-w-[260px] flex-col gap-1">
              <span className="truncate text-sm font-medium">{title}</span>
              <span className="truncate text-xs text-muted-foreground">
                {page} · {section}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: marketingContentTableConfig.fields.page,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Page" />,
        cell: ({ row }: { row: Row<MarketingContentBase> }) => {
          const page = row.original.page ?? "N/A";
          return (
            <span className="inline-flex max-w-[140px] items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium capitalize">
              {String(page).replaceAll("_", " ")}
            </span>
          );
        },
      },
      {
        accessorKey: marketingContentTableConfig.fields.section,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Section" />,
        cell: ({ row }: { row: Row<MarketingContentBase> }) => {
          const section = row.original.section ?? "N/A";
          return (
            <span className="inline-flex max-w-[160px] items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
              {String(section).replaceAll("_", " ")}
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }: { row: Row<MarketingContentBase> }) => {
          const isActive = row.original.isActive;
          const startsAt = row.original.startsAt ? new Date(row.original.startsAt) : null;
          const endsAt = row.original.endsAt ? new Date(row.original.endsAt) : null;

          const now = new Date();
          const isScheduled = !!startsAt && startsAt > now;
          const isExpired = !!endsAt && endsAt < now;

          let label = "Inactive";
          let tone: "default" | "success" | "warning" | "muted" = "muted";

          if (isActive && !isExpired) {
            if (isScheduled) {
              label = "Scheduled";
              tone = "warning";
            } else {
              label = "Live";
              tone = "success";
            }
          } else if (isExpired) {
            label = "Expired";
            tone = "muted";
          }

          const toneClass =
            tone === "success"
              ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
              : tone === "warning"
                ? "bg-amber-50 text-amber-700 ring-amber-100"
                : "bg-muted text-muted-foreground ring-muted-foreground/10";

          return (
            <div className="flex flex-col gap-1">
              <span
                className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${toneClass}`}
              >
                {label}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {startsAt ? `From ${startsAt.toLocaleDateString()}` : "Starts immediately"}
                {endsAt ? ` · Until ${endsAt.toLocaleDateString()}` : ""}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "displayOrder",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Order" />,
        cell: ({ row }: { row: Row<MarketingContentBase> }) => {
          const value = row.getValue("displayOrder") as number | null | undefined;
          return <span className="text-xs font-medium">{typeof value === "number" ? value : 0}</span>;
        },
      },
      ...commonColumns.updatedAtColumn<MarketingContentBase>(),
      ...commonColumns.actionsColumn<MarketingContentBase>({
        deleteMutation: deleteContent,
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDelete,
      }),
    ];
  }, [deleteContent, router]);
}
