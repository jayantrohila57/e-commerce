import { HydrateClient } from "@/core/api/api.server";
import { AccountReviewList } from "@/module/review/components/account-review-list";
import Section from "@/shared/components/layout/section/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

export const metadata = {
  title: "Reviews",
  description: "Manage your product reviews",
};

export default async function ReviewPage() {
  return (
    <HydrateClient>
      <Section {...metadata}>
        <Card>
          <CardHeader>
            <CardTitle>Your Reviews</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <AccountReviewList />
          </CardContent>
        </Card>
      </Section>
    </HydrateClient>
  );
}
