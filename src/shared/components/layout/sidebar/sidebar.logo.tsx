'use client'

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from '@/shared/components/ui/sidebar'
import { Separator } from '../../ui/separator'

export function StudioLogo() {
  return (
    <SidebarMenu className="bg-background rounded-md border p-[2.5px]">
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          asChild
          className="data-[state=open]:border-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-full data-[state=open]:border"
        >
          <div className="flex items-center gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
              <SidebarTrigger />
            </div>
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{'Studio'}</span>
              <span className="truncate text-xs">{'CMS System'}</span>
            </div>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
