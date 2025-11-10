import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'

export function SidebarGetStartedCard() {
  return (
    <Card className="gap-2 data-[state=open]:hidden block py-4 shadow-none">
      <CardHeader className="px-4">
        <CardTitle className="text-sm font-medium">Get Started</CardTitle>
        <CardDescription>Kick off your journey. Build faster. Ship smarter.</CardDescription>
      </CardHeader>
      <CardContent className="px-4">
        <div className="grid gap-2.5">
          <Button
            className="bg-sidebar-primary text-sidebar-primary-foreground w-full shadow-none"
            size="sm"
          >
            Start Now
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
