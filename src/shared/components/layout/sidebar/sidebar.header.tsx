"use client";

import { Separator } from "@/shared/components/ui/separator";
import GoBackButton from "../../common/go-back";
import { Breadcrumbs } from "../breadcrumb/breadcrumbs";
import { SidebarHeaderActions } from "./sidebar.header-action";

export const SidebarHeader = () => {
  return (
    <header className="bg-secondary z-50 h-[60px] p-1 pb-0 group-has-data-[collapsible=icon]/sidebar-wrapper:h-9">
      <div className="bg-background flex h-full w-full items-center rounded-md border p-[2.5px]">
        <div className="flex w-full items-center gap-2 px-2">
          <GoBackButton />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumbs className="text-md w-full" />
        </div>
        <div className="flex flex-row items-center justify-end gap-4 px-2">
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <SidebarHeaderActions />
        </div>
      </div>
    </header>
  );
};
