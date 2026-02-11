'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/shared/components/ui/navigation-menu'
import { useIsMobile } from '@/shared/utils/hooks/use-mobile'
import { apiClient } from '@/core/api/api.client'
import { BlurImage } from '../../ui/image'

export default function NavigationMenuComponent() {
  const isMobile = useIsMobile()

  const { data, isLoading } = apiClient.category.getNestedHierarchy.useQuery({
    query: { limit: 50 },
  })

  const categories = data?.data || []

  if (isLoading) {
    return (
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Loading...</NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    )
  }

  return (
    <div className="max-w-9xl z-9999 container mx-auto my-2 flex h-full w-full items-center justify-between">
      <NavigationMenu viewport={isMobile}>
        <NavigationMenuList className="flex-wrap">
          {/* Dynamic categories */}
          {categories.map((category) => (
            <NavigationMenuItem key={category.id}>
              <NavigationMenuTrigger>{category.title}</NavigationMenuTrigger>

              <NavigationMenuContent>
                <div className="max-w-8xl grid gap-2 p-2 md:w-[calc(100vw-25rem)] lg:w-[calc(100vw-25rem)]">
                  {category.subcategories?.length ? (
                    <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-4">
                      {/* Hero Section */}
                      <div className="col-span-1 hidden flex-col gap-4 border-r pr-6 md:flex">
                        <div className="space-y-2">
                          <h2 className="text-xl font-bold">{category.title}</h2>
                          <p className="text-muted-foreground text-sm leading-snug">
                            {category.description ?? 'Explore the category'}
                          </p>
                        </div>

                        {/* Featured Image */}
                        <div className="bg-muted relative h-40 w-full overflow-hidden rounded-lg border">
                          <BlurImage
                            src={category.image ?? ''}
                            alt={category.title}
                            width={400}
                            height={800}
                            className="aspect-square h-full w-full object-contain p-4"
                          />
                        </div>

                        <Link
                          href={`/store/${category.slug}`}
                          className="text-primary text-sm font-medium hover:underline"
                        >
                          View all products →
                        </Link>
                      </div>

                      {/* Subcategory Columns */}
                      <div className="col-span-3 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {category.subcategories.map((sub) => (
                          <div
                            key={sub.id}
                            className="space-y-3"
                          >
                            <Link
                              href={`/store/${category.slug}/${sub.slug}`}
                              className="group flex items-center gap-3"
                            >
                              <div className="bg-muted relative h-14 w-14 overflow-hidden rounded border">
                                <BlurImage
                                  src={sub.image ?? ''}
                                  alt={sub.title}
                                  width={200}
                                  height={200}
                                  className="object-contain p-2"
                                />
                              </div>
                              <div>
                                <h3 className="font-semibold transition-colors hover:underline">{sub.title}</h3>
                                <p className="text-muted-foreground line-clamp-2 text-xs">{sub.description}</p>
                              </div>
                            </Link>

                            {/* Series list */}
                            <ul className="mt-2 space-y-1 text-sm">
                              {sub.series?.map((series) => (
                                <li key={series.id}>
                                  <Link
                                    href={`/store/${category.slug}/${sub.slug}/${series.slug}`}
                                    className="block transition-colors hover:underline"
                                  >
                                    {series.title}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-sm">No subcategories</div>
                  )}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
