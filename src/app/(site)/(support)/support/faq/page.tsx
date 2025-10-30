import Section from '@/shared/components/layout/section/section'
import Shell from '@/shared/components/layout/shell'

export default function Page() {
  return (
    <Shell>
      <Shell.Section>
        <Section
          title="Frequently Asked Questions"
          description="Answers to the most common questions about our services, pricing and process so you can start with clarity."
        >
          <h1>{'Page'}</h1>
        </Section>
      </Shell.Section>
    </Shell>
  )
}
