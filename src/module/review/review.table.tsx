"use client";

import { Star } from "lucide-react";
import { toast } from "sonner";
import type { RouterOutputs } from "@/core/api/api.client";
import { apiClient } from "@/core/api/api.client";
import { DataTable } from "@/shared/components/table/data-table";
import { filters as tableFilters } from "@/shared/components/table/data-table-filter.config";
import { Button } from "@/shared/components/ui/button";
import { STATUS } from "@/shared/config/api.config";
import { PATH } from "@/shared/config/routes";

type ReviewListOutput = RouterOutputs["review"]["getManyAdmin"];

interface ReviewTableProps {
  data: ReviewListOutput;
}

export function ReviewTable({ data }: ReviewTableProps) {
  const items = data?.data ?? [];
  const pageCount = data?.meta?.pagination?.totalPages;
  const rowCount = data?.meta?.pagination?.total;

  const utils = apiClient.useUtils();
  const updateApproval = apiClient.review.updateApproval.useMutation({
    onSuccess: (res) => {
      void utils.review.getManyAdmin.invalidate();
      if (res.status === STATUS.SUCCESS) {
        toast.success(res.message ?? "Review updated");
      } else {
        toast.error(res.message ?? "Could not update review");
      }
    },
    onError: (err) => {
      toast.error(err.message || "Could not update review");
    },
  });

  return (
    <DataTable
      data={items}
      columns={[
        {
          id: "rating",
          header: "Rating",
          cell: ({ row }) => {
            const rating = row.getValue<number>("rating");
            return (
              <span className="flex items-center gap-0.5 text-xs">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className={`h-3 w-3 ${idx < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                  />
                ))}
              </span>
            );
          },
        },
        {
          id: "title",
          header: "Title",
          accessorKey: "title",
        },
        {
          id: "comment",
          header: "Comment",
          cell: ({ row }) => {
            const value = row.getValue<string | null>("comment") ?? "";
            return value.length > 80 ? `${value.slice(0, 80)}…` : value;
          },
        },
        {
          id: "isApproved",
          header: "Status",
          cell: ({ row }) => {
            const isApproved = row.getValue<boolean>("isApproved");
            return (
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  isApproved ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                }`}
              >
                {isApproved ? "Approved" : "Pending"}
              </span>
            );
          },
        },
        {
          id: "actions",
          header: "",
          cell: ({ row }) => {
            const id = row.original.id;
            const isApproved = row.original.isApproved;
            const busy = updateApproval.isPending;
            return (
              <div className="flex flex-wrap justify-end gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  disabled={busy || isApproved}
                  onClick={() =>
                    updateApproval.mutate({
                      params: { id },
                      body: { isApproved: true },
                    })
                  }
                >
                  Approve
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  disabled={busy || !isApproved}
                  onClick={() =>
                    updateApproval.mutate({
                      params: { id },
                      body: { isApproved: false },
                    })
                  }
                >
                  Unapprove
                </Button>
              </div>
            );
          },
        },
      ]}
      displayKey="id"
      extraFilters={[
        {
          key: "isApproved",
          title: "Status",
          options: [
            { label: "Approved", value: "true", color: "" },
            { label: "Pending", value: "false", color: "" },
          ],
        },
      ]}
      deletionOptions={tableFilters.deletionStatus}
      pageCount={pageCount}
      rowCount={rowCount}
      emptyState={{
        title: "No Reviews",
        description: "There are no product reviews yet.",
        icons: [Star],
        action: {
          label: "View catalog",
          url: PATH.STUDIO.PRODUCTS.ROOT,
        },
      }}
    />
  );
}
