import { CommerceSidebar } from "@/module/account/account.commerce.sidebar";
import { AddressItemList } from "@/module/address/components/address-item-list";
import { AddressSummary } from "@/module/address/components/address-summary";
import Section from "@/shared/components/layout/section/section";

export const metadata = {
  title: "Addresses",
  description: "Manage your shipping and billing addresses",
};
export default async function AddressPage() {
  return (
    <Section className="bg-muted p-4" {...metadata}>
      <div className="grid h-full w-full grid-cols-12 gap-4">
        <div className="col-span-2 hidden lg:block h-full w-full">
          <CommerceSidebar />
        </div>
        <div className="col-span-12 lg:col-span-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <AddressItemList />
          </div>
          <div className="lg:col-span-4">
            <AddressSummary />
          </div>
        </div>
      </div>
    </Section>
  );
}
