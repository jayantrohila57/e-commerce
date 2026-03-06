import Section from "@/shared/components/layout/section/section";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function CheckoutConfirmationLoading() {
  return (
    <Section title="Order confirmation" description="Loading your order…">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="space-y-2 text-center">
          <Skeleton className="mx-auto h-8 w-64" />
          <Skeleton className="mx-auto h-5 w-80" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
        <div className="flex justify-center gap-2">
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-9 w-36" />
        </div>
      </div>
    </Section>
  );
}
