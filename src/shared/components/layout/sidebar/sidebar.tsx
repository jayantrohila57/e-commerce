'use client'

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '../../ui/sidebar'
import { StudioLogo } from './sidebar.logo'
import { NavMain } from './sidebar.navigation'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      {...props}
    >
      <SidebarHeader>
        <StudioLogo />
      </SidebarHeader>
      <SidebarContent className="bg-card p-2">
        <NavMain />
      </SidebarContent>
      <SidebarFooter className="bg-card p-2"></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
