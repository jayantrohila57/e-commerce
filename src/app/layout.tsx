import '@/shared/styles/globals.css'

import { Toaster } from '@/shared/components/ui/sonner'
import { className } from '@/shared/utils/methods/font'
import { ThemeProvider } from '@/core/theme/theme.provider'
import { Providers } from '@/core/query/providers'

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
        <Providers>
          <ThemeProvider>
            {children}
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
