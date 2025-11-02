'use client'

import { Button } from '@/shared/components/ui/button'
import { usePathname } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card'

import type { Route } from 'next'
import { PATH } from '@/shared/config/routes'
import { Separator } from '@/shared/components/ui/separator'
import Link from 'next/link'
import { Boxes, Heart, LocateIcon, ShoppingCart } from 'lucide-react'

type NavItem<T extends string = string> = {
  href: T
  label: string
  icon: React.ReactNode
  id: string
}

const sections: NavItem<Route>[] = [
  { id: 'cart', label: 'Cart', href: PATH.ACCOUNT.CART as Route, icon: <ShoppingCart size={14} /> },
  { id: 'wishlist', label: 'Wishlist', href: PATH.ACCOUNT.WISHLIST as Route, icon: <Heart size={14} /> },
  { id: 'order', label: 'Order', href: PATH.ACCOUNT.ORDER as Route, icon: <Boxes size={14} /> },
  { id: 'address', label: 'Address', href: PATH.ACCOUNT.ADDRESS as Route, icon: <LocateIcon size={14} /> },
  { id: 'review', label: 'Review', href: PATH.ACCOUNT.REVIEW as Route, icon: <LocateIcon size={14} /> },
]

export function CommerceSidebar() {
  const pathname = usePathname()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage your commerce</CardTitle>
        <CardDescription>View & Manage Order, Address & more.</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="px-4">
        <nav className="flex-1">
          <ul className="space-y-4">
            {sections.map((section) => {
              const isActive = pathname === section.href
              return (
                <li key={section.id}>
                  <Link href={section.href}>
                    <Button
                      variant={isActive ? 'default' : 'outline'}
                      className="flex w-full items-center justify-start text-left text-xs"
                    >
                      {section.icon}
                      <span className="font-medium">{section.label}</span>
                    </Button>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </CardContent>
      <Separator />
      <CardFooter></CardFooter>
    </Card>
  )
}
