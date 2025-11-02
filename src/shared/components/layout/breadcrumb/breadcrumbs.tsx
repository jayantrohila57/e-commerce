'use client'

import React from 'react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/components/ui/breadcrumb'
import { cn } from '@/shared/utils/lib/utils'
import { HomeIcon, Slash } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { type Route } from 'next'
import { PATH } from '@/shared/config/routes'
import GoBackButton from '../../common/go-back'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip'

const generateBreadcrumbs = (pathname: string) => {
  const pathArray = pathname?.split('/')?.filter(Boolean)
  const breadcrumbs = pathArray.map((path, index) => {
    const href = `/${pathArray?.slice(0, index + 1)?.join('/')}`
    return { href, label: path }
  })
  return breadcrumbs
}

export function Breadcrumbs({ className }: { className?: string }) {
  const pathname = usePathname()
  const breadcrumbs = generateBreadcrumbs(pathname)

  return (
    <Breadcrumb>
      <BreadcrumbList className={cn('bg-muted/20 rounded-full border px-4 py-[5px] shadow-xs', className)}>
        <BreadcrumbItem>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <BreadcrumbLink href={PATH.ROOT}>
                  <HomeIcon
                    size={16}
                    aria-hidden="true"
                  />
                  <span className="sr-only">Home</span>
                </BreadcrumbLink>
              </TooltipTrigger>
              <TooltipContent>
                <p id="go-back-tooltip">{'Go to website homepage'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </BreadcrumbItem>

        {breadcrumbs?.map((breadcrumb, index) => (
          <React.Fragment key={index}>
            <BreadcrumbSeparator className="first:hidden" />
            <BreadcrumbItem>
              {index === breadcrumbs?.length - 1 ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <BreadcrumbPage className="capitalize">{breadcrumb?.label}</BreadcrumbPage>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p id="go-back-tooltip">{'Your current page'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <BreadcrumbLink
                        asChild
                        className="capitalize underline-offset-4 hover:underline"
                      >
                        <Link href={breadcrumb?.href as Route}>{breadcrumb?.label}</Link>
                      </BreadcrumbLink>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p id="go-back-tooltip">{`Go to ${breadcrumb?.label}`}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
