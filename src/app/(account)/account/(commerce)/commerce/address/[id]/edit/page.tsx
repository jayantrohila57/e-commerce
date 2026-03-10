import { CommerceSidebar } from "@/module/account/account.commerce.sidebar";
import { AddressEditForm } from "@/module/address/components/address-edit-form";
import Section from "@/shared/components/layout/section/section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";

export const metadata = {
  title: "Edit address",
  description: "Update the details of your saved address",
};

export default async function AddressEditPage() {
  return (
    <Section {...metadata}>
      <div className="grid h-full w-full grid-cols-12 gap-4">
        <div className="col-span-2 hidden lg:block h-full w-full">
          <CommerceSidebar />
        </div>
        <div className="col-span-12 lg:col-span-10">
          <Card className="h-full w-full border-none">
            <CardHeader>
              <CardTitle>Edit address</CardTitle>
              <CardDescription>Modify the details for this saved address.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-6 backdrop-blur-sm">
              <AddressEditForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </Section>
  );
}
