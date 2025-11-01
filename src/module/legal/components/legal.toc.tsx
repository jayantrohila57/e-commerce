'use client'

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/shared/components/ui/card'
import { policyContent } from './policy-content'
import { Button } from '@/shared/components/ui/button'
import { Separator } from '@/shared/components/ui/separator'

interface TableOfContentsProps {
  activeSection: string
}

export function TableOfContents({ activeSection }: TableOfContentsProps) {
  const content = policyContent[activeSection]

  if (!content?.tableOfContents || content.tableOfContents.length === 0) {
    return null
  }

  const scrollToSection = (index: number) => {
    const element = document.getElementById(`section-${index}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Table of Contents</CardTitle>
        <CardDescription>Find the section you are looking for in the table of contents below.</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="px-2">
        <nav className="space-y-2">
          {content.tableOfContents.map((item, index) => (
            <Button
              key={index}
              variant={'link'}
              onClick={() => scrollToSection(index)}
            >
              <span className="mt-0.5 shrink-0">{index + 1}.</span>
              <span className="leading-snug">{item}</span>
            </Button>
          ))}
        </nav>
      </CardContent>
    </Card>
  )
}
