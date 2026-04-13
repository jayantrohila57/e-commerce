import { AccountSection } from "@/module/account/account-section";
import { AddressCreateForm } from "@/module/address/components/address-create-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";

export const metadata = {
  title: "Add address",
  description: "Create a new shipping or billing address",
};

export default async function AddressNewPage() {
  return (
    <AccountSection {...metadata}>
      <Card className="h-full w-full border-none">
        <CardHeader>
          <CardTitle>Add new address</CardTitle>
          <CardDescription>Save a new shipping or billing address to your account.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 backdrop-blur-sm sm:p-6">
          <AddressCreateForm />
        </CardContent>
      </Card>
    </AccountSection>
  );
}
