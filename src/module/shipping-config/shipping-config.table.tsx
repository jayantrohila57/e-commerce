"use client";

import { Truck } from "lucide-react";
import type { RouterOutputs } from "@/core/api/api.client";
import { DataTable } from "@/shared/components/table/data-table";
import { filters as tableFilters } from "@/shared/components/table/data-table-filter.config";

type ProviderListOutput = RouterOutputs["shippingConfig"]["listProviders"];
type MethodListOutput = RouterOutputs["shippingConfig"]["listMethods"];
type ZoneListOutput = RouterOutputs["shippingConfig"]["listZones"];
type RateRuleListOutput = RouterOutputs["shippingConfig"]["listRateRules"];

interface ShippingTablePropsBase<T> {
  data: T;
}

export function ShippingProviderTable({ data }: ShippingTablePropsBase<ProviderListOutput>) {
  const items = data?.data ?? [];
  const pageCount = data?.meta?.pagination?.totalPages;
  const rowCount = data?.meta?.pagination?.total;

  return (
    <DataTable
      data={items}
      columns={[
        {
          id: "name",
          header: "Name",
          accessorKey: "name",
        },
        {
          id: "code",
          header: "Code",
          accessorKey: "code",
        },
        {
          id: "isActive",
          header: "Active",
          accessorKey: "isActive",
        },
      ]}
      displayKey="name"
      extraFilters={[
        {
          key: "isActive",
          title: "Active",
          options: [
            { label: "Active", value: "true", color: "" },
            { label: "Inactive", value: "false", color: "" },
          ],
        },
      ]}
      deletionOptions={tableFilters.deletionStatus}
      pageCount={pageCount}
      rowCount={rowCount}
      emptyState={{
        title: "No Shipping Providers",
        description: "You have not configured any shipping providers yet.",
        icons: [Truck],
        action: {
          label: "Create Shipping Provider",
          url: "/studio/shipping?view=providers",
        },
      }}
    />
  );
}

export function ShippingMethodTable({ data }: ShippingTablePropsBase<MethodListOutput>) {
  const items = data?.data ?? [];
  const pageCount = data?.meta?.pagination?.totalPages;
  const rowCount = data?.meta?.pagination?.total;

  return (
    <DataTable
      data={items}
      columns={[
        {
          id: "name",
          header: "Name",
          accessorKey: "name",
        },
        {
          id: "code",
          header: "Code",
          accessorKey: "code",
        },
        {
          id: "providerId",
          header: "Provider ID",
          accessorKey: "providerId",
        },
        {
          id: "isActive",
          header: "Active",
          accessorKey: "isActive",
        },
      ]}
      displayKey="name"
      extraFilters={[]}
      deletionOptions={tableFilters.deletionStatus}
      pageCount={pageCount}
      rowCount={rowCount}
      emptyState={{
        title: "No Shipping Methods",
        description: "You have not configured any shipping methods yet.",
        icons: [Truck],
        action: {
          label: "Create Shipping Method",
          url: "/studio/shipping?view=methods",
        },
      }}
    />
  );
}

export function ShippingZoneTable({ data }: ShippingTablePropsBase<ZoneListOutput>) {
  const items = data?.data ?? [];
  const pageCount = data?.meta?.pagination?.totalPages;
  const rowCount = data?.meta?.pagination?.total;

  return (
    <DataTable
      data={items}
      columns={[
        {
          id: "name",
          header: "Name",
          accessorKey: "name",
        },
        {
          id: "countryCode",
          header: "Country",
          accessorKey: "countryCode",
        },
        {
          id: "regionCode",
          header: "Region",
          accessorKey: "regionCode",
        },
        {
          id: "isActive",
          header: "Active",
          accessorKey: "isActive",
        },
      ]}
      displayKey="name"
      extraFilters={[]}
      deletionOptions={tableFilters.deletionStatus}
      pageCount={pageCount}
      rowCount={rowCount}
      emptyState={{
        title: "No Shipping Zones",
        description: "You have not configured any shipping zones yet.",
        icons: [Truck],
        action: {
          label: "Create Shipping Zone",
          url: "/studio/shipping?view=zones",
        },
      }}
    />
  );
}

export function ShippingRateRuleTable({ data }: ShippingTablePropsBase<RateRuleListOutput>) {
  const items = data?.data ?? [];
  const pageCount = data?.meta?.pagination?.totalPages;
  const rowCount = data?.meta?.pagination?.total;

  return (
    <DataTable
      data={items}
      columns={[
        {
          id: "methodId",
          header: "Method ID",
          accessorKey: "methodId",
        },
        {
          id: "zoneId",
          header: "Zone ID",
          accessorKey: "zoneId",
        },
        {
          id: "price",
          header: "Price (₹)",
          cell: ({ row }) => {
            const value = row.getValue<number>("price");
            return `₹${(value / 100).toFixed(0)}`;
          },
        },
        {
          id: "isActive",
          header: "Active",
          accessorKey: "isActive",
        },
      ]}
      displayKey="id"
      extraFilters={[]}
      deletionOptions={tableFilters.deletionStatus}
      pageCount={pageCount}
      rowCount={rowCount}
      emptyState={{
        title: "No Shipping Rates",
        description: "You have not configured any shipping rates yet.",
        icons: [Truck],
        action: {
          label: "Create Shipping Rate",
          url: "/studio/shipping?view=rates",
        },
      }}
    />
  );
}
