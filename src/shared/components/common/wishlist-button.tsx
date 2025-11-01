'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'

export default function WishListButton() {
  const [count, setCount] = useState(7)

  const handleClick = () => {
    setCount(0)
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="relative"
            onClick={handleClick}
            aria-label="Wishlist"
          >
            <Heart
              size={16}
              aria-hidden="true"
            />
            {count > 0 && (
              <Badge className="absolute -top-2 left-full min-w-5 -translate-x-1/2 px-1">
                {count > 99 ? '99+' : count}
              </Badge>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p id="wishlist-tooltip">{'You have ' + count + ' items in your wishlist'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
