"use client";

import { Separator } from "../../ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "../../ui/sidebar";
import { NavMain } from "./sidebar.navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b h-16">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="p-2 h-12 group-data-[collapsible=icon]:p-2!  group-data-[collapsible=icon]:h-12! w-full group-data-[collapsible=icon]:w-12!"
            >
              <div className="flex items-center gap-2  w-full">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                  <SidebarTrigger />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-3xl ">{"Studio"}</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
