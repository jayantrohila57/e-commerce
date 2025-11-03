import { cn } from '@/shared/utils/lib/utils'
import { Button } from '../../ui/button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../ui/card'
import { Separator } from '../../ui/separator'

interface SectionProps {
  title?: string
  description?: string
  action?: string
  children: React.ReactNode
  separator?: boolean
  variant?: 'default' | 'full'
  className?: string
}

export default function Section({
  variant,
  title,
  description,
  action,
  children,
  separator = true,
  className,
}: SectionProps) {
  return (
    <Card className={cn('bg-card/0 gap-0 border-none p-0 shadow-none', className)}>
      {title && description && (
        <div className={variant === 'full' ? 'w-full' : 'max-w-9xl container mx-auto mb-4'}>
          <CardHeader className="px-0">
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
            <CardAction>{action && <Button variant={'outline'}>{action}</Button>}</CardAction>
          </CardHeader>
        </div>
      )}
      {separator && <Separator className="mb-4" />}
      <CardContent className="min-h-[600px] p-0">{children}</CardContent>
    </Card>
  )
}
