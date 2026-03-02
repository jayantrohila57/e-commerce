import { Skeleton } from "@/shared/components/ui/skeleton";

export const PDPSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-md" />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          <Skeleton className="h-8 w-1/4" />

          {/* Variant Selectors */}
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i}>
                <Skeleton className="mb-2 h-5 w-1/4" />
                <div className="flex flex-wrap gap-2">
                  {[...Array(3)].map((_, j) => (
                    <Skeleton key={j} className="h-9 w-20 rounded-md" />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 w-32" />
          </div>

          {/* Description & Features */}
          <div className="space-y-4 pt-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            <div>
              <Skeleton className="mb-2 h-5 w-1/4" />
              <ul className="space-y-2 pl-5">
                {[...Array(3)].map((_, i) => (
                  <li key={i}>
                    <Skeleton className="h-4 w-5/6" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
