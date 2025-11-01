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
import { Slash } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { type Route } from 'next'

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
      <BreadcrumbList className={cn('mt-0.5 text-lg', className)}>
        {breadcrumbs?.map((breadcrumb, index) => (
          <React.Fragment key={index}>
            <BreadcrumbSeparator className="first:hidden">
              <Slash className="-rotate-20" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              {index === breadcrumbs?.length - 1 ? (
                <BreadcrumbPage className="capitalize">{breadcrumb?.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  asChild
                  className="capitalize underline-offset-4 hover:underline"
                >
                  <Link href={breadcrumb?.href as Route}>{breadcrumb?.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
