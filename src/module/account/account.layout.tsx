import AccountCommerceComponent from "./account.commerce-layout";
import AccountUserComponent from "./account.user-layout";
import { AccountSidebar } from "./account-sidebar";

export default function AccountRootComponent() {
  return (
    <div className="grid h-full min-h-[800px] w-full grid-cols-12 shadow-none">
      <div className="col-span-2 h-full  border-b w-full">
        <AccountSidebar />
      </div>
      <div className="col-span-10 h-full p-4 border-b border-r w-full">
        <AccountUserComponent />
        <AccountCommerceComponent />
      </div>
    </div>
  );
}
