"use client";

import { Book, PencilIcon, Plus, Tag } from "lucide-react";
import type { RouterOutputs } from "@/core/api/api.client";
import { DataTable } from "@/shared/components/table/data-table";
import { filters as tableFilters } from "@/shared/components/table/data-table-filter.config";
import { useShipmentBulkActions } from "./shipment.bulk-actions";
import { useShipmentColumns } from "./shipment.columns";
import { shipmentTableConfig } from "./shipment.table.config";
import type { GetManyShipmentsOutput } from "./shipment.types";

type ProviderListOutput = RouterOutputs["shippingConfig"]["listProviders"];
type MethodListOutput = RouterOutputs["shippingConfig"]["listMethods"];

interface ShipmentTableProps {
  data: GetManyShipmentsOutput;
  providers: ProviderListOutput;
  methods: MethodListOutput;
}

export default function ShipmentTable({ data, providers, methods }: ShipmentTableProps) {
  const providerItems = providers?.data ?? [];
  const methodItems = methods?.data ?? [];

  const providerNamesById = Object.fromEntries(providerItems.map((p) => [p.id, p.name] as const));
  const methodNamesById = Object.fromEntries(methodItems.map((m) => [m.id, m.name] as const));

  const columns = useShipmentColumns({ providerNamesById, methodNamesById });
  const bulkActions = useShipmentBulkActions();

  const items = data?.data ?? [];
  const pageCount = data?.meta?.pagination?.totalPages;
  const rowCount = data?.meta?.pagination?.total;

  return (
    <DataTable
      data={items}
      columns={columns}
      displayKey={shipmentTableConfig.fields.id}
      extraFilters={[
        {
          key: "status",
          title: "Status",
          options: [
            { label: "Pending", value: "pending", color: "" },
            { label: "In Transit", value: "in_transit", color: "" },
            { label: "Out for Delivery", value: "out_for_delivery", color: "" },
            { label: "Delivered", value: "delivered", color: "" },
            { label: "Returned", value: "returned", color: "" },
          ],
        },
        {
          key: "carrier",
          title: "Carrier",
          options: Array.from(new Set(items.map((item) => item.carrier).filter(Boolean))).map((carrier) => ({
            label: String(carrier),
            value: String(carrier),
            color: "",
          })),
        },
        {
          key: "shippingProviderId",
          title: "Provider",
          options: providerItems.map((provider) => ({
            label: provider.name,
            value: provider.id,
            color: "",
          })),
        },
        {
          key: "shippingMethodId",
          title: "Method",
          options: methodItems.map((method) => ({
            label: method.name,
            value: method.id,
            color: "",
          })),
        },
      ]}
      deletionOptions={tableFilters.deletionStatus}
      bulkActions={bulkActions}
      pageCount={pageCount}
      rowCount={rowCount}
      emptyState={{
        title: "No Shipments Found",
        description: "There are no shipments yet.",
        icons: [Book, PencilIcon, Tag],
        action: {
          label: "Create Shipment",
          url: "/studio/orders",
        },
      }}
    />
  );
}
