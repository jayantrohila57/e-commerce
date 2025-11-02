import Shell from '@/shared/components/layout/shell'
import Header from '@/shared/components/layout/header/header'
import { SubNavHeader } from '@/shared/components/layout/section/auth.header'
import Section from '@/shared/components/layout/section/section'
import Footer from '@/shared/components/layout/footer/footer'

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Shell>
      <Shell.Header>
        <Header />
      </Shell.Header>
      <Shell.Main>
        <Shell.Section>
          <Section>
            <SubNavHeader />
            {children}
          </Section>
        </Shell.Section>
      </Shell.Main>
      <Shell.Footer>
        <Footer />
      </Shell.Footer>
    </Shell>
  )
}
