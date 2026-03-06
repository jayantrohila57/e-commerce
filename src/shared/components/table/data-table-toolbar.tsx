"use client";

import { X } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useDataTableContext } from "./data-table-context";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { EnhancedDataTableSelectedActions } from "./data-table-selection-action";
import { DataTableViewOptions } from "./data-table-view-options";

export function DataTableToolbar<TData>() {
  const {
    table,
    displayKey,
    statusOptions,
    typeOptions,
    visibilityOptions,
    featuredOptions,
    deletionOptions,
    filters,
    setFilter,
    setSearch,
    clearFilters,
  } = useDataTableContext<TData>();

  const isFiltered =
    table?.getState().columnFilters.length > 0 ||
    Object.values(filters ?? {}).some((v) => v !== null && v !== undefined);

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {(() => {
          try {
            const column = table.getColumn(displayKey as string);
            return column ? (
              <Input
                placeholder={`Filter by ${displayKey.toString()}...`}
                value={filters?.q ?? (column.getFilterValue() as string) ?? ""}
                onChange={(event) => {
                  const val = event.target.value;
                  column.setFilterValue(val);
                  setSearch?.(val);
                }}
                className="bg-input/30 h-8 w-[150px] lg:w-[250px]"
              />
            ) : null;
          } catch (e) {
            return null;
          }
        })()}
        {statusOptions && statusOptions.length > 0 && (
          <DataTableFacetedFilter
            title="Status"
            options={statusOptions}
            value={filters?.status}
            onSelect={(val) => setFilter?.("status", val)}
          />
        )}
        {visibilityOptions && visibilityOptions.length > 0 && (
          <DataTableFacetedFilter
            title="Visibility"
            options={visibilityOptions}
            value={filters?.visibility}
            onSelect={(val) => setFilter?.("visibility", val)}
          />
        )}
        {typeOptions && typeOptions.length > 0 && (
          <DataTableFacetedFilter
            title="Display Type"
            options={typeOptions}
            value={filters?.displayType}
            onSelect={(val) => setFilter?.("displayType", val)}
          />
        )}
        {featuredOptions && featuredOptions.length > 0 && (
          <DataTableFacetedFilter
            title="Featured"
            options={featuredOptions}
            value={filters?.isFeatured}
            onSelect={(val) => setFilter?.("isFeatured", val)}
          />
        )}
        {deletionOptions && deletionOptions.length > 0 && (
          <DataTableFacetedFilter
            title="Deleted"
            options={deletionOptions}
            value={filters?.deleted}
            onSelect={(val) => setFilter?.("deleted", val)}
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table?.resetColumnFilters();
              clearFilters?.();
            }}
            className="h-7 px-2 lg:px-3"
          >
            Reset Filters
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <EnhancedDataTableSelectedActions />
        <DataTableViewOptions />
      </div>
    </div>
  );
}
