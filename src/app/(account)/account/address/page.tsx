import { AccountSection } from "@/module/account/account-section";
import { AddressItemList } from "@/module/address/components/address-item-list";
import { AddressSummary } from "@/module/address/components/address-summary";

export const metadata = {
  title: "Addresses",
  description: "Manage your shipping and billing addresses",
};

export default async function AddressPage() {
  return (
    <AccountSection {...metadata}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-12">
          <AddressItemList />
          <AddressSummary />
        </div>
      </div>
    </AccountSection>
  );
}
