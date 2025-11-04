'use client'

import { Separator } from '@/shared/components/ui/separator'
import { Breadcrumbs } from '../breadcrumb/breadcrumbs'
import { SidebarHeaderActions } from './sidebar.header-action'
import GoBackButton from '../../common/go-back'

export const SidebarHeader = () => {
  return (
    <header className="z-50 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center gap-2 px-4">
        <GoBackButton />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumbs className="text-md" />
      </div>
      <div className="flex w-full flex-row items-center justify-end gap-4 px-4">
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <SidebarHeaderActions />
      </div>
    </header>
  )
}
