'use client'

import { Separator } from '@/shared/components/ui/separator'
import { Breadcrumbs } from '../breadcrumb/breadcrumbs'
import { SidebarHeaderActions } from './sidebar.header-action'
import GoBackButton from '../../common/go-back'

export const SidebarHeader = () => {
  return (
    <header className="z-50 bg-secondary p-1 pb-0 h-[60px] group-has-data-[collapsible=icon]/sidebar-wrapper:h-9">
      <div className="flex items-center h-full w-full  bg-background rounded-md border p-[2.5px]">
        <div className="flex w-full items-center gap-2 px-2">
          <GoBackButton />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumbs className="text-md" />
        </div>
        <div className="flex w-full flex-row items-center justify-end gap-4 px-2">
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <SidebarHeaderActions />
        </div>
      </div>
    </header>
  )
}
