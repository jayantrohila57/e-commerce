import '@/shared/styles/globals.css'

import { Toaster } from '@/shared/components/ui/sonner'
import { className } from '@/shared/utils/methods/font'
import { ThemeProvider } from '@/core/theme/theme.provider'

export default function RootLayout({ children }: LayoutProps<'/'>) {
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
