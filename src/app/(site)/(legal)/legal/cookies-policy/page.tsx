import Section from '@/shared/components/layout/section/section'
import Shell from '@/shared/components/layout/shell'

export default function Page() {
  return (
    <Shell>
      <Shell.Section>
        <Section
          title="Cookies Policy"
          description="This page contains information about the cookies used by our organization."
        >
          <h1>{'Cookies Policy'}</h1>
        </Section>
      </Shell.Section>
    </Shell>
  )
}
