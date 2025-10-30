import Shell from '@/shared/components/layout/shell'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Shell>
      <Shell.Header>
        <div className="header">header</div>
      </Shell.Header>
      <Shell.Main>{children}</Shell.Main>
      <Shell.Footer>
        <div className="footer">footer</div>
      </Shell.Footer>
    </Shell>
  )
}
