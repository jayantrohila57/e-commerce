import Shell from '@/shared/components/layout/shell'
import Header from '@/shared/components/layout/header/header'
import Footer from '@/shared/components/layout/footer/footer'
import ScrollToTopButton from '@/shared/components/common/scroll-to-top'

import { ScrollProgress } from '@/shared/components/common/scroll-progress'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Shell>
      {/* <PushNotificationPrompt /> */}
      <ScrollProgress />
      <ScrollToTopButton />
      {/* <CookieConsent /> */}
      <Shell.Header>
        <Header />
        {/* <PromoBanner /> */}
      </Shell.Header>
      <Shell.Main>{children}</Shell.Main>
      <Shell.Footer>
        <Footer />
      </Shell.Footer>
    </Shell>
  )
}
