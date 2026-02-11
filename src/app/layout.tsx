import '@/shared/styles/globals.css'

import { TRPCReactProvider } from '@/core/api/api.client'
import { ThemeProvider } from '@/core/theme/theme.provider'
import { Toaster } from '@/shared/components/ui/sonner'
import { className, viewport } from '@/shared/utils/methods/font'

export { viewport }

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
        <TRPCReactProvider>
          <ThemeProvider>
            {children}
            <Toaster />
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  )
}
