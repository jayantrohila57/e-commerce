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
}

export default function Section({ variant, title, description, action, children, separator = false }: SectionProps) {
  return (
    <Card className="bg-card/0 border-none p-0 shadow-none">
      {title && description && (
        <CardHeader className={variant === 'full' ? 'w-full p-0' : 'max-w-9xl container mx-auto p-0'}>
          {title && <CardTitle className="font-oswald text-5xl">{title}</CardTitle>}
          {description && <CardDescription className="max-w-5xl text-xl">{description}</CardDescription>}
          <CardAction>{action && <Button variant={'outline'}>{action}</Button>}</CardAction>
        </CardHeader>
      )}
      <CardContent className="min-h-[600px] p-0">{children}</CardContent>
      {separator && (
        <CardFooter className="px-0">
          <Separator />
        </CardFooter>
      )}
    </Card>
  )
}
