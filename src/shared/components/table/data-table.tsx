"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { type ComponentType, useMemo, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { useTableUrlSync } from "@/shared/utils/hooks/use-table-url-sync";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Separator } from "../ui/separator";
import type { BulkAction } from "./custom-action/bulk-operations.factory";
import { useBulkActions } from "./custom-action/bulk-operations.factory";
import { DataTableProvider } from "./data-table-context";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  typeOptions?: {
    label: string;
    value: string;
    color: string;
    icon?: ComponentType<{ className?: string }>;
  }[];
  statusOptions?: {
    label: string;
    value: string;
    color: string;
    icon?: ComponentType<{ className?: string }>;
  }[];
  visibilityOptions?: {
    label: string;
    value: string;
    color: string;
    icon?: ComponentType<{ className?: string }>;
  }[];
  featuredOptions?: {
    label: string;
    value: string;
    color: string;
    icon?: ComponentType<{ className?: string }>;
  }[];
  displayKey: keyof TData;
  bulkActions?: BulkAction<TData>[];
  deletionOptions?: {
    label: string;
    value: string;
    color: string;
    icon?: ComponentType<{ className?: string }>;
  }[];
  pageCount?: number;
  rowCount?: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  typeOptions,
  statusOptions,
  visibilityOptions,
  featuredOptions,
  deletionOptions,
  displayKey,
  bulkActions,
  pageCount,
  rowCount,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const { setFilter, setSearch, clearFilters } = useTableUrlSync();
  const searchParams = useSearchParams();

  const currentFilters = useMemo(() => {
    const filters: Record<string, string | null> = {};
    const keys = ["status", "visibility", "displayType", "color", "contentType", "isFeatured", "deleted"];
    keys.forEach((key) => {
      filters[key] = searchParams.get(key);
    });
    return filters;
  }, [searchParams]);

  const pagination = useMemo(
    () => ({
      pageIndex: Math.max(0, parseInt(searchParams.get("page") ?? "1", 10) - 1),
      pageSize: parseInt(searchParams.get("limit") ?? "20", 10),
    }),
    [searchParams],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    pageCount: pageCount ?? -1,
    manualPagination: true,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const selectedRows = useMemo(() => table.getSelectedRowModel().rows.map((row) => row.original), [table]);
  const hasSelectedRows = selectedRows.length > 0;

  const bulk = useBulkActions<TData>({
    actions: bulkActions ?? [],
    onSuccess: () => {
      table.toggleAllRowsSelected(false);
    },
  });

  const [confirmationData, setConfirmationData] = useState<{
    actionId: string;
    rows: TData[];
    message: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    actionLabel: string;
  } | null>(null);

  const runBulkAction = (actionId: string) => {
    const action = bulkActions?.find((a) => a.id === actionId);
    if (!action) return;
    if (action.requiresConfirmation) {
      const message =
        action.confirmationMessage?.(selectedRows) ??
        `Are you sure you want to ${action.label.toLowerCase()} ${selectedRows.length} item(s)?`;
      setConfirmationData({
        actionId,
        rows: selectedRows,
        message,
        variant: action.variant,
        actionLabel: action.label,
      });
      return;
    }
    void bulk.runBulkAction(actionId, selectedRows);
  };

  return (
    <DataTableProvider
      value={{
        table,
        displayKey,
        selectedRows,
        hasSelectedRows,
        clearSelection: () => table.toggleAllRowsSelected(false),
        typeOptions,
        statusOptions,
        visibilityOptions,
        featuredOptions,
        deletionOptions,
        filters: currentFilters,
        setFilter,
        setSearch,
        clearFilters,
        bulkActions,
        runBulkAction: bulkActions && bulkActions.length > 0 ? runBulkAction : undefined,
        isBulkActionLoading: bulk.isBulkActionLoading,
        rowCount: rowCount ?? data.length,
      }}
    >
      <Card className="p-0 bg-transparent border-none shadow-none">
        <CardContent className="p-0">
          <DataTableToolbar />
        </CardContent>
        <CardContent className="relative overflow-x-hidden p-0">
          <Table>
            <TableHeader className="sticky top-0 z-10 rounded-md">
              {table?.getHeaderGroups()?.map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-[60vh] text-center">
                    No results found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              {table.getFooterGroups().map((footerGroup) => (
                <TableRow key={footerGroup.id}>
                  {footerGroup.headers.map((header) => (
                    <TableCell key={header.id}>
                      {flexRender(header.column.columnDef.footer, header.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableFooter>
          </Table>
        </CardContent>
        <CardFooter className="w-full p-0">
          <DataTablePagination />
        </CardFooter>
      </Card>
      <AlertDialog open={!!confirmationData} onOpenChange={(open) => !open && setConfirmationData(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmationData?.variant === "destructive" ? "⚠️ " : ""}
              {confirmationData?.actionLabel || "Confirm Action"}
            </AlertDialogTitle>
            <AlertDialogDescription>{confirmationData?.message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{"Cancel"}</AlertDialogCancel>
            <AlertDialogAction
              className={
                confirmationData?.variant === "destructive"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
              onClick={() => {
                if (confirmationData) {
                  void bulk.runBulkAction(confirmationData.actionId, confirmationData.rows);
                  setConfirmationData(null);
                }
              }}
            >
              {confirmationData?.actionLabel || "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DataTableProvider>
  );
}
