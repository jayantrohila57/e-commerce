'use client'

import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Toggle } from '@/shared/components/ui/toggle'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip'

export function ModeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            variant="outline"
            className="group data-[state=on]:hover:bg-muted size-9 rounded-full data-[state=on]:bg-transparent transition-all"
            pressed={theme === 'dark'}
            onPressedChange={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {/* Note: After dark mode implementation, rely on dark: prefix rather than group-data-[state=on]: */}
            <MoonIcon
              size={16}
              className="transition-all shrink-0 scale-0 opacity-0 dark:scale-100 dark:opacity-100"
              aria-hidden="true"
            />
            <SunIcon
              size={16}
              className="transition-all absolute shrink-0 scale-100 opacity-100 dark:scale-0 dark:opacity-0"
              aria-hidden="true"
            />
          </Toggle>
        </TooltipTrigger>
        <TooltipContent>
          <p>Toggle Theme</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
