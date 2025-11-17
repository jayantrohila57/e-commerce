'use client'

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '../../ui/sidebar'
import { SidebarGetStartedCard } from './sidebar.getStarted-card'
import { StudioLogo } from './sidebar.logo'
import { NavMain } from './sidebar.navigation'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      {...props}
    >
      <SidebarHeader className="py-1 pr-0 pl-1">
        <StudioLogo />
      </SidebarHeader>
      <SidebarContent className="h-full pl-1">
        <NavMain />
      </SidebarContent>
      <SidebarFooter className="py-1 pr-0 pl-1">
        <SidebarGetStartedCard />
      </SidebarFooter>
    </Sidebar>
  )
}
