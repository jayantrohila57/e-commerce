"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";
import { apiClient } from "@/core/api/api.client";
import { DataTableColumnHeader } from "@/shared/components/table/data-table-column-header";
import { commonColumns } from "@/shared/components/table/data-table-columns";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { STATUS } from "@/shared/config/api.config";
import { PATH } from "@/shared/config/routes";
import type { SubcategoryBase } from "./subcategory.schema";

export function useSubcategoryColumns(): ColumnDef<SubcategoryBase>[] {
  const router = useRouter();
  const utils = apiClient.useUtils();

  const deleteSubcategory = apiClient.subcategory.delete.useMutation({
    onSuccess: async ({ status, message }) => {
      if (status === STATUS.SUCCESS) {
        toast.success(message);
        await utils.subcategory.getMany.invalidate();
      } else {
        toast.error(message);
      }
    },
    onError: (err) => toast.error(err.message),
  });

  return useMemo(() => {
    const handleView = (row: Row<SubcategoryBase>) => {
      const slug = row.getValue("slug");
      const categorySlug = row.getValue("categorySlug");
      if (slug && typeof slug === "string" && categorySlug && typeof categorySlug === "string") {
        router.push(PATH.STUDIO.SUB_CATEGORIES.ROOT(categorySlug, slug) as Route);
      }
    };

    const handleDelete = (row: Row<SubcategoryBase>) => {
      const id = row.getValue("id");
      const title = String(row.getValue("title") ?? "this subcategory");
      if (id && typeof id === "string") {
        if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
          deleteSubcategory.mutate({ params: { id } });
        }
      }
    };

    const hiddenCategorySlugColumn: ColumnDef<SubcategoryBase> = {
      accessorKey: "categorySlug",
      header: () => null,
      cell: () => null,
      enableHiding: true,
      enableSorting: false,
    };

    const titleColumn: ColumnDef<SubcategoryBase> = {
      accessorKey: "title",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
      cell: ({ row }) => {
        const title = String(row.getValue("title") ?? "N/A");
        const slug = row.getValue("slug") as string;
        const categorySlug = row.getValue("categorySlug") as string;

        if (!slug || !categorySlug) return null;

        return (
          <div className="text-foreground line-clamp-1 gap-2 pr-1 pl-0.5 text-sm min-w-[220px]">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={PATH.STUDIO.SUB_CATEGORIES.ROOT(categorySlug, slug) as Route}
                  className="max-w-[260px] truncate text-sm font-medium underline-offset-4 hover:underline"
                >
                  {title}
                </Link>
              </TooltipTrigger>
              <TooltipContent>{title}</TooltipContent>
            </Tooltip>
          </div>
        );
      },
    };

    return [
      ...commonColumns.selectColumn<SubcategoryBase>(),
      hiddenCategorySlugColumn,
      titleColumn,
      // keep a simple slug column for view-in-store and to back title logic
      ...commonColumns.slugColumn<SubcategoryBase>("/store"),
      ...commonColumns.descriptionColumn<SubcategoryBase>(),
      ...commonColumns.displayTypeColumn<SubcategoryBase>(),
      ...commonColumns.visibilityColumn<SubcategoryBase>(),
      ...commonColumns.isFeaturedColumn<SubcategoryBase>(),
      ...commonColumns.colorColumn<SubcategoryBase>(),
      ...commonColumns.createdAtColumn<SubcategoryBase>(),
      ...commonColumns.updatedAtColumn<SubcategoryBase>(),
      ...commonColumns.actionsColumn<SubcategoryBase>({
        deleteMutation: deleteSubcategory,
        onView: handleView,
        onDelete: handleDelete,
      }),
    ];
  }, [deleteSubcategory, router, utils]);
}
