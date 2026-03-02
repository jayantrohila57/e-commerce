import AccountCommerceComponent from "./account.commerce-layout";
import AccountUserComponent from "./account.user-layout";

export default function AccountRootComponent() {
  return (
    <div className="space-y-6">
      <AccountUserComponent />
      <AccountCommerceComponent />
    </div>
  );
}
