import { AccountSection } from "@/module/account/account-section";
import { AddressEditForm } from "@/module/address/components/address-edit-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";

export const metadata = {
  title: "Edit address",
  description: "Update the details of your saved address",
};

export default async function AddressEditPage() {
  return (
    <AccountSection {...metadata}>
      <Card className="h-full w-full border-none">
        <CardHeader>
          <CardTitle>Edit address</CardTitle>
          <CardDescription>Modify the details for this saved address.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 backdrop-blur-sm sm:p-6">
          <AddressEditForm />
        </CardContent>
      </Card>
    </AccountSection>
  );
}
