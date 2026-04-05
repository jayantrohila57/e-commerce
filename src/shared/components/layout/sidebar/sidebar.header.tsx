import GoBackButton from "../../common/go-back";
import { Breadcrumbs } from "../breadcrumb/breadcrumbs";
import { SidebarHeaderActions } from "./sidebar.header-action";

export const SidebarHeader = () => {
  return (
    <header className="bg-background border-b h-16 group-has-data-[collapsible=icon]/sidebar-wrapper:h-16">
      <div className="flex h-full w-full items-center">
        <div className="flex w-full items-center">
          <div className="h-16 w-16 flex items-center justify-center">
            <GoBackButton />
          </div>
          <div className="h-16 w-auto min-w-80 border-x flex items-center justify-start px-6">
            <Breadcrumbs className="text-md w-full" />
          </div>
        </div>
        <div className="flex flex-row items-center justify-end">
          <SidebarHeaderActions />
        </div>
      </div>
    </header>
  );
};
