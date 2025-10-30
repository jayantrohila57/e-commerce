import Section from '@/shared/components/layout/section/section'
import Shell from '@/shared/components/layout/shell'

export default function Page() {
  return (
    <Shell>
      <Shell.Section>
        <Section
          title="Legal"
          description="Get help with any issues or questions you may have."
        >
          <h1>{'Legal Page'}</h1>
        </Section>
      </Shell.Section>
    </Shell>
  )
}
