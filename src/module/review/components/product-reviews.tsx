"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { z } from "zod/v3";
import { apiClient } from "@/core/api/api.client";
import { useSession } from "@/core/auth/auth.client";
import { reviewInsertSchema } from "@/module/review/review.schema";
import Form from "@/shared/components/form/form";
import { FormSection } from "@/shared/components/form/form.helper";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { handleTrpcAuthClientError } from "@/shared/utils/handle-trpc-auth-error";

interface ProductReviewsProps {
  productId: string;
  canWriteReview?: boolean;
}

const reviewCreateSchema = reviewInsertSchema.pick({
  rating: true,
  title: true,
  content: true,
});

type ReviewFormValues = z.infer<typeof reviewCreateSchema>;

export function ProductReviews({ productId, canWriteReview = false }: ProductReviewsProps) {
  const { data: session } = useSession();
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, isLoading } = apiClient.review.getMany.useQuery({
    query: {
      limit,
      offset: (page - 1) * limit,
      productId,
      isApproved: true,
    },
  });

  const reviews = data?.data ?? [];
  const total = data?.meta?.count ?? reviews.length;
  const pageCount = Math.max(1, Math.ceil(total / limit));

  const utils = apiClient.useUtils();
  const createReview = apiClient.review.create.useMutation({
    onSuccess: () => {
      void utils.review.getMany.invalidate();
    },
    onError: (err) => {
      if (handleTrpcAuthClientError(err, "Please sign in to post a review.")) return;
      toast.error("Could not submit your review. Please try again.");
    },
  });

  const showForm = canWriteReview && !!session?.user;

  const averageRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) / reviews.length : 0;

  return (
    <div className="space-y-6 mt-8">
      <Card className="border-border bg-muted/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base font-semibold">
            <span>Customer reviews</span>
            {reviews.length > 0 && (
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{averageRating.toFixed(1)} / 5</span>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <span>{total} review(s)</span>
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading && <p className="text-xs text-muted-foreground">Loading reviews…</p>}

          {!isLoading && reviews.length === 0 && (
            <p className="text-xs text-muted-foreground">No reviews yet. Be the first to review this product.</p>
          )}

          {!isLoading && reviews.length > 0 && (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="rounded-md border border-border bg-background/60 p-3 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
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
                  {review.title && <p className="mt-1 text-sm font-medium">{review.title}</p>}
                  {review.comment && <p className="mt-1 text-xs text-muted-foreground">{review.comment}</p>}
                </div>
              ))}

              {pageCount > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="outline"
                    size="xs"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <span className="text-[11px] text-muted-foreground">
                    Page {page} of {pageCount}
                  </span>
                  <Button
                    variant="outline"
                    size="xs"
                    disabled={page >= pageCount}
                    onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}

          {showForm && (
            <div className="pt-4 border-t border-border/70">
              <h3 className="mb-2 text-sm font-semibold">Write a review</h3>
              <Form<typeof reviewCreateSchema>
                schema={reviewCreateSchema}
                defaultValues={{
                  rating: 5,
                  title: "",
                  content: "",
                }}
                onSubmitAction={async (values: ReviewFormValues) => {
                  await createReview.mutateAsync({
                    body: {
                      productId,
                      rating: values.rating,
                      title: values.title || undefined,
                      content: values.content,
                      images: [],
                    },
                  });
                }}
              >
                <FormSection title="Rating" description="How would you rate this product?" required>
                  <Form.Field
                    name="rating"
                    type="radio"
                    options={Array.from({ length: 5 }).map((_, idx) => ({
                      value: String(idx + 1),
                      label: `${idx + 1} star${idx === 0 ? "" : "s"}`,
                    }))}
                    required
                  />
                </FormSection>
                <FormSection title="Title" description="Optional short title for your review.">
                  <Form.Field name="title" type="text" placeholder="Great quality and value" />
                </FormSection>
                <FormSection
                  title="Review"
                  description="Share details about your experience. Your review will appear once approved."
                  required
                >
                  <Form.Field
                    name="content"
                    type="textarea"
                    placeholder="What did you like or dislike? How is the fit, quality, and overall experience?"
                    required
                  />
                </FormSection>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <Form.StatusBadge />
                  <Button type="submit" size="sm" disabled={createReview.isPending}>
                    {createReview.isPending ? "Submitting…" : "Submit review"}
                  </Button>
                </div>
              </Form>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
