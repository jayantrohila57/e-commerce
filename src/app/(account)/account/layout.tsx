import type React from 'react'

import Shell from '@/shared/components/layout/shell'
import Header from '@/shared/components/layout/header/header'
import Footer from '@/shared/components/layout/footer/footer'
import { ScrollProgress } from '@/shared/components/common/scroll-progress'
import ScrollToTopButton from '@/shared/components/common/scroll-to-top'
import { SubNavHeader } from '@/shared/components/layout/section/section.header'

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <Shell>
      <ScrollProgress />
      <ScrollToTopButton />
      <Shell.Header>
        <Header />
      </Shell.Header>
      <Shell.Main>
        <Shell.Section>
          <SubNavHeader />
          {children}
        </Shell.Section>
      </Shell.Main>
      <Shell.Footer>
        <Footer />
      </Shell.Footer>
    </Shell>
  )
}
