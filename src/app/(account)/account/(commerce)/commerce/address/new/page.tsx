import { CommerceSidebar } from "@/module/account/account.commerce.sidebar";
import { AddressCreateForm } from "@/module/address/components/address-create-form";
import Section from "@/shared/components/layout/section/section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";

export const metadata = {
  title: "Add address",
  description: "Create a new shipping or billing address",
};

export default async function AddressNewPage() {
  return (
    <Section className="bg-muted p-4" {...metadata}>
      <div className="grid h-full w-full grid-cols-12 gap-4">
        <div className="col-span-2 hidden lg:block h-full w-full">
          <CommerceSidebar />
        </div>
        <div className="col-span-12 lg:col-span-10">
          <Card className="h-full w-full border-none">
            <CardHeader>
              <CardTitle>Add new address</CardTitle>
              <CardDescription>Save a new shipping or billing address to your account.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-6 backdrop-blur-sm">
              <AddressCreateForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </Section>
  );
}
