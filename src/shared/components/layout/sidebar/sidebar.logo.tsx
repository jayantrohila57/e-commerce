'use client'

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from '@/shared/components/ui/sidebar'

export function StudioLogo() {
  return (
    <SidebarMenu className="rounded-md">
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          asChild
          className="data-[state=open]:border-sidebar-accent data-[state=open]:text-sidebar-accent-foreground data-[state=open]:border"
        >
          <div className="flex items-center gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
              <SidebarTrigger />
            </div>
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
