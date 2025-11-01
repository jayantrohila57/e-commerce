import Link from 'next/link'
import { Button } from '@/shared/components/ui/button'
import { Separator } from '@/shared/components/ui/separator'
import { site } from '@/shared/config/site'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { policyContent } from './policy-content'

interface LegalContentProps {
  activeSection: string
}

export function LegalSidebar({ activeSection }: LegalContentProps) {
  const sections = Object.values(policyContent)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Policy Sections</CardTitle>
        <CardDescription>Legal policy sections</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="px-4">
        <nav className="flex-1">
          <ul className="space-y-4">
            {sections.map((section) => {
              const isActive = activeSection === section.id
              return (
                <li key={section.id}>
                  <Link href={section.href}>
                    <Button
                      variant={isActive ? 'default' : 'outline'}
                      className="flex w-full items-center justify-start text-left text-xs"
                    >
                      {section.icon}
                      <span className="font-medium">{section.title}</span>
                    </Button>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </CardContent>
      <Separator />
      <CardFooter>
        <p>{site.legalUpdate}</p>
      </CardFooter>
    </Card>
  )
}
