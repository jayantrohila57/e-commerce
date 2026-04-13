"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { SquareArrowOutUpRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";
import { apiClient } from "@/core/api/api.client";
import { DataTableColumnHeader } from "@/shared/components/table/data-table-column-header";
import { commonColumns } from "@/shared/components/table/data-table-columns";
import { Button } from "@/shared/components/ui/button";
import { STATUS } from "@/shared/config/api.config";
import { productTableConfig } from "./product.table.config";
import type { ProductBase } from "./product.types";

export function useProductColumns() {
  const router = useRouter();
  const utils = apiClient.useUtils();

  const deleteProduct = apiClient.product.delete.useMutation({
    onSuccess: async ({ status, message }) => {
      if (status === STATUS.SUCCESS) {
        toast.success(message);
        await utils.product.getMany.invalidate();
      } else {
        toast.error(message);
      }
    },
    onError: (err) => toast.error(err.message),
  });

  return useMemo<ColumnDef<ProductBase>[]>(() => {
    const handleView = (row: Row<ProductBase>) => {
      const categorySlug = row.original.categorySlug;
      const subcategorySlug = row.original.subcategorySlug;
      if (categorySlug && subcategorySlug) {
        window.open(productTableConfig.routes.storeSubcategory(categorySlug, subcategorySlug), "_blank");
      }
    };

    const handleEdit = (row: Row<ProductBase>) => {
      const slug = row.getValue(productTableConfig.fields.slug);
      const id = row.getValue(productTableConfig.fields.id);
      if (slug && typeof slug === "string" && id && typeof id === "string") {
        router.push(productTableConfig.routes.editBySlug(slug, id) as Route);
      }
    };

    const handleDelete = (row: Row<ProductBase>) => {
      const id = row.getValue(productTableConfig.fields.id);
      const title = String(row.getValue(productTableConfig.fields.title) ?? "this product");
      if (id && typeof id === "string") {
        if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
          deleteProduct.mutate({ params: { id } });
        }
      }
    };

    return [
      ...commonColumns.selectColumn<ProductBase>(),
      ...commonColumns.titleColumn<ProductBase>(productTableConfig.routes.studio),
      {
        accessorKey: "categorySlug",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
        cell: ({ row }) => (
          <div className="w-[160px] truncate text-xs text-muted-foreground">
            {row.getValue("categorySlug") as string}
          </div>
        ),
      },
      {
        accessorKey: "subcategorySlug",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Subcategory" />,
        cell: ({ row }) => (
          <div className="w-[160px] truncate text-xs text-muted-foreground">
            {row.getValue("subcategorySlug") as string}
          </div>
        ),
      },
      ...commonColumns.statusColumn<ProductBase>(),
      {
        accessorKey: productTableConfig.fields.slug,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Store" />,
        cell: ({ row }) => {
          const href = productTableConfig.routes.storeSubcategory(
            row.original.categorySlug,
            row.original.subcategorySlug,
          );
          return (
            <div className="flex w-[120px]">
              <Link href={href as Route} target="_blank" rel="noopener noreferrer">
                <Button variant="link">
                  View <SquareArrowOutUpRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          );
        },
      },
      ...commonColumns.createdAtColumn<ProductBase>(),
      ...commonColumns.updatedAtColumn<ProductBase>(),
      ...commonColumns.actionsColumn<ProductBase>({
        deleteMutation: deleteProduct,
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDelete,
      }),
    ];
  }, [deleteProduct, router]);
}
