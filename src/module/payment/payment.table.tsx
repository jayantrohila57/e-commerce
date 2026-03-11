"use client";

import { CreditCard, PencilIcon, Tag } from "lucide-react";
import { EmptyState } from "@/shared/components/common/empty-state";
import { DataTable } from "@/shared/components/table/data-table";
import { filters as tableFilters } from "@/shared/components/table/data-table-filter.config";
import type { DetailedResponse } from "@/shared/schema";
import { usePaymentColumns } from "./payment.columns";
import type { Payment } from "./payment.schema";

type GetManyPaymentsOutput = DetailedResponse<Payment[]>;

export default function PaymentTable({ data }: { data: GetManyPaymentsOutput }) {
  const columns = usePaymentColumns();

  const items = data?.data ?? [];
  const pageCount = data?.meta?.pagination?.totalPages;
  const rowCount = data?.meta?.pagination?.total;

  return (
    <DataTable
      data={items}
      columns={columns}
      displayKey={"id"}
      deletionOptions={tableFilters.deletionStatus}
      pageCount={pageCount}
      rowCount={rowCount}
      emptyState={{
        title: "No Payments Found",
        description: "There are no payment transactions yet.",
        icons: [CreditCard, PencilIcon, Tag],
        action: {
          label: "View Orders",
          url: "/studio/orders",
        },
      }}
    />
  );
}
