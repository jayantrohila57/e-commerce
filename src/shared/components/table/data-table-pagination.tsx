"use client";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useTableUrlSync } from "@/shared/utils/hooks/use-table-url-sync";
import { useDataTableContext } from "./data-table-context";

export function DataTablePagination<TData>() {
  const { table, rowCount } = useDataTableContext<TData>();
  const { setPagination } = useTableUrlSync();

  const handlePageChange = (page: number) => {
    table.setPageIndex(page);
    setPagination(page + 1, table.getState().pagination.pageSize);
  };

  const handlePageSizeChange = (size: number) => {
    table.setPageSize(size);
    setPagination(1, size); // Reset to page 1 when size changes
  };

  const pagination = table.getState().pagination;
  const total = rowCount ?? table.getFilteredRowModel().rows.length;
  const pageIndex = pagination.pageIndex;
  const pageSize = pagination.pageSize;
  const start = total === 0 ? 0 : pageIndex * pageSize + 1;
  const end = total === 0 ? 0 : Math.min(total, (pageIndex + 1) * pageSize);

  return (
    <div className="flex w-full items-center justify-between px-2">
      <div className="text-muted-foreground flex-1 text-sm">
        {total > 0
          ? `Showing ${start}-${end} of ${total} items`
          : "No items to display"}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              handlePageSizeChange(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => handlePageChange(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(table.getState().pagination.pageIndex - 1)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(table.getState().pagination.pageIndex + 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => handlePageChange(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
