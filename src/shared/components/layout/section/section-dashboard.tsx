import Link from 'next/link'
import { Button } from '../../ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { slugToTitle } from '@/shared/utils/lib/url.utils'
import GoBackButton from '../../common/go-back'

interface SectionProps {
  title?: string
  description?: string
  action?: string
  actionUrl?: string
  children: React.ReactNode
}

export default function DashboardSection({ title, description, action, actionUrl, children }: SectionProps) {
  return (
    <Card className="bg-card h-full w-full gap-0 rounded-md pb-0">
      {title && description && (
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex h-full w-full flex-row items-center justify-end gap-4">
            <GoBackButton />
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
      <div className="h-[calc(100vh-10.2rem)] overflow-auto">
        <CardContent className="px-4">{children}</CardContent>
      </div>
    </Card>
  )
}
