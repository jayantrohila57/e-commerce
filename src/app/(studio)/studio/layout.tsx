import Shell from '@/shared/components/layout/shell'
import { AppSidebar } from '@/shared/components/layout/sidebar/sidebar'
import { SidebarHeader } from '@/shared/components/layout/sidebar/sidebar.header'
import { SidebarInset, SidebarProvider } from '@/shared/components/ui/sidebar'

export default async function Layout({ children }: LayoutProps<'/studio'>) {
  return (
    <Shell>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SidebarHeader />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </Shell>
  )
}
