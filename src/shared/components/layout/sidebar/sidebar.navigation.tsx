'use client'

import {
  ChevronRight,
  type LucideIcon,
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  DollarSign,
  BarChart3,
  Settings2,
  LifeBuoy,
  Truck,
  MessageSquare,
} from 'lucide-react'
import { cn } from '@/shared/utils/lib/utils'
import { usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useId } from 'react'
import { PATH } from '@/shared/config/routes'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/shared/components/ui/sidebar'
import { type Route } from 'next'
import { Separator } from '../../ui/separator'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../ui/collapsible'

interface NavItem {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: NavItem[]
}

export function useIsActive() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  return (url: string, strict = false) => {
    const [targetPath, targetQuery = ''] = url.split('?')
    if (strict) {
      if (pathname !== targetPath) return false
    } else {
      if (pathname !== targetPath && !pathname.startsWith(targetPath + '/')) {
        return false
      }
    }

    if (targetQuery) {
      const query = new URLSearchParams(targetQuery)
      for (const [key, value] of query.entries()) {
        if (searchParams.get(key) !== value) return false
      }
    }

    return true
  }
}

export function NavMain() {
  const isActive = useIsActive()
  const collapsibleId = useId()
  const mainItems: NavItem[] = [
    {
      title: 'Overview',
      url: PATH.STUDIO.ROOT,
      icon: LayoutDashboard,
    },
    {
      title: 'Products',
      url: PATH.STUDIO.PRODUCTS.ROOT,
      icon: Package,
      items: [
        { title: 'All Products', url: PATH.STUDIO.PRODUCTS.ROOT },
        { title: 'Add Product', url: PATH.STUDIO.PRODUCTS.NEW },
        { title: 'Categories', url: PATH.STUDIO.CATEGORIES.ROOT },
      ],
    },
    {
      title: 'Orders',
      url: PATH.STUDIO.ORDERS.ROOT,
      icon: ShoppingBag,
      items: [
        { title: 'All Orders', url: PATH.STUDIO.ORDERS.ROOT },
        { title: 'Pending', url: `${PATH.STUDIO.ORDERS.ROOT}?status=pending` },
        { title: 'Completed', url: `${PATH.STUDIO.ORDERS.ROOT}?status=completed` },
      ],
    },
    {
      title: 'Customers',
      url: PATH.STUDIO.CUSTOMERS.ROOT,
      icon: Users,
      items: [
        { title: 'All Customers', url: PATH.STUDIO.CUSTOMERS.ROOT },
        { title: 'Segments', url: `${PATH.STUDIO.CUSTOMERS.ROOT}/segments` },
      ],
    },
    {
      title: 'Marketing',
      url: PATH.STUDIO.MARKETING.ROOT,
      icon: MessageSquare,
      items: [
        { title: 'Campaigns', url: PATH.STUDIO.MARKETING.CAMPAIGNS },
        { title: 'Discounts', url: PATH.STUDIO.DISCOUNTS.ROOT },
      ],
    },
    {
      title: 'Payments & Finance',
      url: PATH.STUDIO.PAYMENTS.ROOT,
      icon: DollarSign,
      items: [
        { title: 'Transactions', url: PATH.STUDIO.PAYMENTS.ROOT },
        { title: 'Shipping', url: PATH.STUDIO.SHIPPING.ROOT, icon: Truck },
      ],
    },
    {
      title: 'Analytics',
      url: PATH.STUDIO.ANALYTICS.ROOT,
      icon: BarChart3,
      items: [
        { title: 'Sales', url: PATH.STUDIO.ANALYTICS.SALES },
        { title: 'Customers', url: PATH.STUDIO.ANALYTICS.CUSTOMERS },
      ],
    },
  ]

  const setting: NavItem[] = [
    {
      title: 'Settings',
      url: PATH.STUDIO.SETTINGS.ROOT,
      icon: Settings2,
      items: [
        { title: 'Profile', url: PATH.STUDIO.SETTINGS.PROFILE },
        { title: 'Team', url: PATH.STUDIO.SETTINGS.TEAM },
      ],
    },
    {
      title: 'Support',
      url: PATH.SITE.SUPPORT.ROOT,
      icon: LifeBuoy,
    },
  ]

  return (
    <div>
      {[
        { title: 'Studio', section: mainItems },
        { title: 'Settings', section: setting },
      ]?.map((section, sectionIndex) => (
        <SidebarGroup
          className="p-0"
          key={sectionIndex}
        >
          <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
          <SidebarMenu key={sectionIndex}>
            {section?.section?.map((item, itemIndex) => {
              const hasActiveChild = item.items?.some((sub) => isActive(sub.url)) || false
              const isItemActive = isActive(item.url, true) || hasActiveChild
              const hasChildren = !!item.items?.length
              const itemId = `${collapsibleId}-${sectionIndex}-${itemIndex}`

              if (!hasChildren) {
                return (
                  <SidebarMenuItem key={item.title}>
                    <Link href={item.url as Route}>
                      <SidebarMenuButton tooltip={item.title}>
                        {item.icon && (
                          <item.icon className={cn('h-5 w-5', isItemActive ? 'opacity-100' : 'opacity-70')} />
                        )}
                        <span className={cn(isItemActive ? 'font-medium' : 'font-normal')}>{item.title}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                )
              }

              return (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={isItemActive}
                  id={itemId}
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className={cn(
                          'transition-colors',
                          isItemActive && 'bg-accent text-accent-foreground',
                          !isItemActive && 'hover:bg-accent/50',
                        )}
                      >
                        {item.icon && (
                          <item.icon className={cn('h-4 w-4', isItemActive ? 'opacity-100' : 'opacity-70')} />
                        )}
                        <span className={cn(isItemActive ? 'font-medium' : 'font-normal')}>{item.title}</span>
                        <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => {
                          const isSubItemActive = isActive(subItem.url)
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <Link
                                  href={subItem.url as Route}
                                  className={cn(
                                    'block w-full',
                                    isSubItemActive
                                      ? 'bg-primary text-primary-foreground'
                                      : 'text-muted-foreground hover:text-foreground',
                                  )}
                                >
                                  {subItem.icon && (
                                    <subItem.icon
                                      className={cn('h-4 w-4', isItemActive ? 'opacity-100' : 'opacity-70')}
                                    />
                                  )}

                                  <span
                                    className={cn('transition-colors', isSubItemActive ? 'font-medium' : 'font-normal')}
                                  >
                                    {subItem.title}
                                  </span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              )
            })}
          </SidebarMenu>
          <Separator className="my-4" />
        </SidebarGroup>
      ))}
    </div>
  )
}
