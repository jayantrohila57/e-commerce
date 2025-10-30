import Section from '@/shared/components/layout/section/section'
import Shell from '@/shared/components/layout/shell'

export default function Page() {
  return (
    <Shell>
      <Shell.Section>
        <Section
          title="Licenses"
          description="This page contains information about the licenses used by our organization."
        >
          <h1>{'Licenses'}</h1>
        </Section>
      </Shell.Section>
    </Shell>
  )
}
