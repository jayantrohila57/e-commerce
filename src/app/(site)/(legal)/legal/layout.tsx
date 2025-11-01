import { SubNavHeader } from '@/shared/components/layout/section/auth.header'
import Shell from '@/shared/components/layout/shell'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Shell>
      <Shell.Section>
        <SubNavHeader />
        {children}
      </Shell.Section>
    </Shell>
  )
}
