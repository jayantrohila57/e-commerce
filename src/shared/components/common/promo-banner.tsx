'use client'

import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { X, Sparkles } from 'lucide-react'

export function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="from-primary to-primary/80 text-primary-foreground relative container mx-auto mt-4 rounded-md bg-linear-to-r px-4 py-2">
      <div className="container mx-auto flex items-center justify-center gap-4">
        <Sparkles className="h-5 w-5" />
        <div className="text-center text-sm">
          <span className="font-medium">{'EXTRA 15% ON ORDERS ABOVE ₹4499*'}</span>
          <span className="ml-2">{'Discount auto-applied at checkout | *Exclusions Apply'}</span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="text-primary-foreground hover:bg-primary-foreground/20 absolute right-4"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
