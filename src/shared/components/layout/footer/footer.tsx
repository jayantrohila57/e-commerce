import Social from '@/shared/components/common/social'
import { Icons } from '@/shared/components/common/icons'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { ThemeToggle } from '@/shared/components/theme/theme-toggle'
import RSS from '@/shared/components/common/rss'
import { Separator } from '@/shared/components/ui/separator'
import Link from 'next/link'
import { PATH } from '@/shared/config/routes'
import { site } from '@/shared/config/site'

import type { Route } from 'next'
import { AppBrand } from '../section/auth.card-layout'

type NavItem<T extends string = string> = {
  href: T
  title: string
  newTab: boolean
}

interface NavType {
  title: string
  submenu: NavItem<Route>[]
}

export const footer: NavType[] = [
  {
    title: 'Shop',
    submenu: [
      { title: 'New Arrivals', href: '/store/new' as Route, newTab: false },
      { title: 'Best Sellers', href: '/store/best-sellers' as Route, newTab: false },
      { title: 'Sale', href: '/store/sale' as Route, newTab: false },
      { title: 'Gift Cards', href: '/store/gift-cards' as Route, newTab: false },
      { title: 'All Products', href: '/store' as Route, newTab: false },
    ],
  },
  {
    title: 'Customer Care',
    submenu: [
      { title: 'Track Order', href: '/orders/track' as Route, newTab: false },
      { title: 'Shipping Info', href: '/support/shipping' as Route, newTab: false },
      { title: 'Returns & Exchanges', href: '/support/returns' as Route, newTab: false },
      { title: 'Size Guide', href: '/support/size-guide' as Route, newTab: false },
      { title: 'Contact Support', href: '/support/contact' as Route, newTab: false },
    ],
  },
  {
    title: 'Legal',
    submenu: [
      { title: 'Privacy Policy', href: '/legal/privacy-policy' as Route, newTab: false },
      { title: 'Terms of Service', href: '/legal/terms-of-service' as Route, newTab: false },
      { title: 'Refund Policy', href: '/legal/refund-policy' as Route, newTab: false },
      { title: 'Cookies Settings', href: '/legal/cookies-policy' as Route, newTab: false },
    ],
  },
  {
    title: 'Connect',
    submenu: [
      { title: 'Instagram', href: 'https://instagram.com/yourstore' as Route, newTab: true },
      { title: 'Twitter', href: 'https://twitter.com/yourstore' as Route, newTab: true },
      { title: 'Facebook', href: 'https://facebook.com/yourstore' as Route, newTab: true },
      { title: 'Newsletter', href: '/newsletter' as Route, newTab: false },
    ],
  },
]

export default function Footer() {
  return (
    <div className="max-w-9xl container mx-auto h-full w-full items-center justify-between">
      <Separator />
      <div className="h-full w-full flex-row py-10">
        <div className="relative flex flex-col-reverse justify-between gap-8 md:flex-row">
          <div className="z-10 flex max-w-2xl flex-col justify-between gap-8 py-5 pr-5 sm:flex-row md:max-w-xs md:flex-col md:pt-0">
            <div className="w-full">
              <Link href={PATH.ROOT}>
                <div className="flex flex-row items-start justify-start gap-1">
                  <div className="mt-1 text-2xl font-medium">{site.name}</div>
                </div>
              </Link>
              <p className="text-muted-foreground pb-5 text-sm leading-tight">{site.description}</p>
              <p className="pb-1 text-sm">
                <span className="text-muted-foreground pr-2">{'Email:'}</span>
                {site.email}
              </p>
              <p className="pb-1 text-sm">
                <span className="text-muted-foreground pr-2">{'Phone:'}</span> {site.phone}
              </p>
              <p className="w-full pb-1 text-sm">
                <span className="text-muted-foreground pr-2">{'Address:'}</span> {site.address}
              </p>
            </div>
            <div className="grid w-full grid-cols-2 gap-8">
              <div className="col-span-2">
                <h4 className="mb-2 text-lg font-semibold">{'Supported Payment'}</h4>
                <div className="flex space-x-2">
                  <Icons.paypal className="h-6 w-9" />
                  <Icons.visa className="h-10 w-auto" />
                </div>
              </div>
              <div className="col-span-2">
                <h4 className="mb-2 text-lg font-semibold">{'Connect On Social'}</h4>
                <div className="flex gap-5">
                  <Social />
                </div>
              </div>
            </div>
          </div>
          <div className="z-10 col-span-1 grid w-full max-w-7xl grid-cols-1 gap-8 py-5 md:col-span-2 md:pt-0">
            <div className="grid w-full grid-cols-1 gap-8 py-5 md:grid-cols-4 md:py-0">
              <div className="col-span-2"></div>
              <div className="col-span-1 md:col-span-2">
                <h4 className="mb-2 text-lg font-semibold">{'Sign up to our Newsletter'}</h4>
                <form className="flex space-x-2">
                  <Input
                    className="flex-1"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button
                    size={'sm'}
                    type="submit"
                  >
                    {'Subscribe'}
                  </Button>
                </form>
              </div>
            </div>
            <Separator />
            <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-6 md:gap-4">
              {footer?.map(({ title, submenu }) => {
                return (
                  <div key={title}>
                    <h3 className="mb-4 text-xl font-semibold">{(title && title) || 'No Title'}</h3>
                    <ul className="space-y-1 text-sm md:space-y-2">
                      {submenu?.map(({ newTab, href, title }) => {
                        return (
                          <li key={href + title}>
                            <Link
                              className="underline-offset-4 hover:underline"
                              target={newTab ? '_blank' : '_self'}
                              href={href || PATH.ROOT}
                            >
                              {title || 'No Title'}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <Separator className="my-2 mb-8" />
        <div className="flex h-full w-full items-center justify-between">
          <AppBrand />
          <div className="flex h-full w-auto items-center justify-start gap-4">
            <ThemeToggle />
            <RSS />
          </div>
        </div>
      </div>
    </div>
  )
}
