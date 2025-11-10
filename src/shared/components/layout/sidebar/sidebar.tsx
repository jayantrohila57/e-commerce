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
      <SidebarHeader className="pr-0 pl-1 py-1">
        <StudioLogo />
      </SidebarHeader>
      <SidebarContent className="pl-1">
        <NavMain />
      </SidebarContent>
      <SidebarFooter className="pl-1">
        <SidebarGetStartedCard />
      </SidebarFooter>
    </Sidebar>
  )
}
