interface ProductReviewsProps {
  productId: string;
  canWriteReview?: boolean;
}

export function ProductReviews({ productId, canWriteReview = false }: ProductReviewsProps) {
  return <div className="space-y-6"></div>;
}
