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
    <nav className="flex flex-col items-start justify-start px-2">
      <div className="">
        <p className="text-lg font-medium">Table of Contents</p>
      </div>
      {content.tableOfContents.map((item, index) => (
        <Button
          key={index}
          variant={'link'}
          size={'sm'}
          className="p-0 text-xs"
          onClick={() => scrollToSection(index)}
        >
          <span className="shrink-0">{index + 1}.</span>
          <span className="leading-snug">{item}</span>
        </Button>
      ))}
    </nav>
  )
}
