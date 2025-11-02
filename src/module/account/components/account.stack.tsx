import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import type { LucideIcon } from 'lucide-react'
import { type Route } from 'next'
import Link from 'next/link'

type SectionItem = {
  name: string
  description: string
  icon: LucideIcon
  link: Route
}

type Category = {
  id: string
  name: string
  icon: LucideIcon
  sections: SectionItem[]
}

export function ContentStack({ data }: { data: Category[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
      {data.map((category) => {
        const Icon = category.icon
        return (
          <Card
            key={category.id}
            className="grid grid-cols-8 gap-4"
          >
            <CardHeader className="col-span-2">
              <div className="flex flex-row items-center justify-start space-x-2">
                <div className="bg-primary/10 text-primary rounded-full p-2">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl">{category.name}</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="col-span-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {category.sections.map((section) => {
                  const SectionIcon = section.icon
                  return (
                    <Link
                      href={section.link}
                      key={section.name}
                    >
                      <div className="bg-muted hover:bg-muted/70 rounded-2xl p-4 transition-all hover:shadow-md">
                        <div className="mb-2 flex items-center gap-2">
                          <SectionIcon className="text-primary h-4 w-4" />
                          <h4 className="text-lg font-medium">{section.name}</h4>
                        </div>
                        <p className="text-muted-foreground text-sm">{section.description}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
