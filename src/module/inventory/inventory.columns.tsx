"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { apiClient } from "@/core/api/api.client";
import { DataTableColumnHeader } from "@/shared/components/table/data-table-column-header";
import { commonColumns } from "@/shared/components/table/data-table-columns";
import type { InventoryBase } from "./inventory.types";
import { inventoryTableConfig } from "./inventory.table.config";

const baseColumns: ColumnDef<InventoryBase>[] = [
  {
    accessorKey: "sku",
    header: ({ column }) => <DataTableColumnHeader column={column} title="SKU" />,
    cell: ({ row }) => <div className="w-[160px] truncate text-sm">{row.getValue("sku")}</div>,
  },
  {
    accessorKey: "barcode",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Barcode" />,
    cell: ({ row }) => (
      <div className="w-[180px] truncate text-sm text-muted-foreground">{row.getValue("barcode") ?? "—"}</div>
    ),
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Quantity" />,
    cell: ({ row }) => <div className="w-[80px] text-sm">{row.getValue("quantity")}</div>,
  },
  {
    accessorKey: "incoming",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Incoming" />,
    cell: ({ row }) => <div className="w-[80px] text-sm">{row.getValue("incoming")}</div>,
  },
  {
    accessorKey: "reserved",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Reserved" />,
    cell: ({ row }) => <div className="w-[80px] text-sm">{row.getValue("reserved")}</div>,
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Updated At" />,
    cell: ({ row }) => {
      const date = row.getValue("updatedAt") as Date | null;
      return (
        <div className="w-[160px] text-sm text-muted-foreground">{date ? new Date(date).toLocaleString() : "—"}</div>
      );
    },
  },
];

export function useInventoryColumns() {
  const router = useRouter();
  const utils = apiClient.useUtils();

  const deleteInventory = apiClient.inventory.delete.useMutation({
    onSuccess: async () => {
      await utils.inventory.getMany.invalidate();
      router.refresh();
    },
  });

  return useMemo(() => {
    const handleView = (row: Row<InventoryBase>) => {
      const id = row.getValue(inventoryTableConfig.fields.id);
      if (id && typeof id === "string") {
        router.push(inventoryTableConfig.routes.view(id) as Route);
      }
    };

    const handleDelete = (row: Row<InventoryBase>) => {
      const id = row.getValue(inventoryTableConfig.fields.id);
      const sku = String(row.getValue(inventoryTableConfig.fields.sku) ?? "this inventory");
      if (id && typeof id === "string") {
        if (window.confirm(`Are you sure you want to delete inventory for "${sku}"?`)) {
          deleteInventory.mutate({ params: { id } });
        }
      }
    };

    return [
      ...commonColumns.selectColumn<InventoryBase>(),
      ...baseColumns,
      ...commonColumns.actionsColumn<InventoryBase>({
        deleteMutation: deleteInventory,
        onView: handleView,
        onDelete: handleDelete,
      }),
    ];
  }, [deleteInventory, router]);
}
