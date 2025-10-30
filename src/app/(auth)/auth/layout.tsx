import Shell from '@/shared/components/layout/shell'
import Header from '@/shared/components/layout/header/header'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Shell>
      <Shell.Header>
        <Header />
      </Shell.Header>
      <Shell.Main>{children}</Shell.Main>
      <Shell.Footer>
        <div className="footer">footer</div>
      </Shell.Footer>
    </Shell>
  )
}
