import { AddressItemList } from "@/module/address/components/address-item-list";
import { AddressSummary } from "@/module/address/components/address-summary";
import Section from "@/shared/components/layout/section/section";

export const metadata = {
  title: "Addresses",
  description: "Manage your shipping and billing addresses",
};

export default async function AddressPage() {
  return (
    <Section {...metadata}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-12">
          <AddressItemList />
          <AddressSummary />
        </div>
      </div>
    </Section>
  );
}
