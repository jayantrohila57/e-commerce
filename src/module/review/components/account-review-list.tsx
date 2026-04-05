"use client";

import { Star } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/core/api/api.client";
import { useSession } from "@/core/auth/auth.client";
import { Button } from "@/shared/components/ui/button";
import { PATH } from "@/shared/config/routes";

export function AccountReviewList() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data, isLoading } = apiClient.review.getMany.useQuery(
    {
      query: {
        limit: 20,
        offset: 0,
        userId,
      },
    },
    {
      enabled: !!userId,
    },
  );

  if (!userId) {
    return <p className="text-sm text-muted-foreground">You need to be signed in to view your reviews.</p>;
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading your reviews…</p>;
  }

  const reviews = data?.data ?? [];

  if (!reviews.length) {
    return (
      <div className="flex flex-col items-start justify-between gap-2 rounded-md border border-dashed p-4 text-sm text-muted-foreground md:flex-row md:items-center">
        <span>You haven&apos;t written any reviews yet.</span>
        <Button size="sm" variant="outline" asChild>
          <Link href={PATH.ACCOUNT.ORDER}>Browse your orders</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="flex flex-col gap-2 rounded-md border border-border bg-muted/20 p-3 text-sm md:flex-row md:items-start md:justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className={`h-3 w-3 ${
                      idx < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[11px] text-muted-foreground">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            {review.title && <p className="font-medium">{review.title}</p>}
            {review.comment && <p className="text-xs text-muted-foreground">{review.comment}</p>}
          </div>
          <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                review.isApproved ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
              }`}
            >
              {review.isApproved ? "Approved" : "Pending approval"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
