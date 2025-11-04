import Link from 'next/link'
import { Button } from '../../ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { slugToTitle } from '@/shared/utils/lib/url.utils'
import type { Route } from 'next'

interface SectionProps<T extends string = string> {
  title?: string
  description?: string
  action?: string
  actionUrl?: T
  children: React.ReactNode
}

export default function DashboardSection({ title, description, action, actionUrl, children }: SectionProps<Route>) {
  return (
    <Card className="bg-card motion-all h-full w-full gap-0 rounded-md p-0">
      {title && description && (
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <div className="flex h-full w-full flex-row items-center justify-end gap-2">
            <div className="h-full w-full">
              {title && <CardTitle>{slugToTitle(title)}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
            </div>
            <CardAction>
              {action && (
                <Button
                  variant={'default'}
                  asChild={actionUrl ? true : false}
                >
                  {actionUrl && <Link href={actionUrl}>{action}</Link>}
                </Button>
              )}
            </CardAction>
          </div>
        </CardHeader>
      )}
      <div className="motion-all h-[calc(100vh-10.2rem)] overflow-auto">
        <CardContent className="px-4">{children}</CardContent>
      </div>
    </Card>
  )
}
