import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function SubCategoriesListingSkeleton() {
  return (
    <div className="flex flex-col">
      {/* Header Skeleton */}
      <div className="flex flex-col items-center justify-center gap-4">
        <Skeleton className="bg-secondary h-32 w-32 rounded-full" />
        <div className="text-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="mt-2 h-5 w-96" />
        </div>
      </div>

      <Separator className="my-8" />

      {/* Products Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8]?.map((item) => (
          <Card key={item} className="pt-0">
            <CardHeader className="p-0">
              <Skeleton className="bg-secondary aspect-square w-full rounded-b-none" />
            </CardHeader>
            <CardContent className="flex flex-col gap-3 p-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-5 w-1/3" />
              <div className="mt-2 flex flex-col gap-1">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
