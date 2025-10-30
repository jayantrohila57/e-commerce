import '@/shared/styles/globals.css'

import { Toaster } from '@/shared/components/ui/sonner'
import { className } from '@/shared/utils/methods/font'
import { ThemeProvider } from '@/core/theme/theme.provider'
import { type NextUrls } from '@/shared/config/next-urls'

export default function RootLayout({ children }: LayoutProps<NextUrls['ROOT']>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className={className}
      >
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
