import Section from '@/shared/components/layout/section/section'
import Shell from '@/shared/components/layout/shell'

export default function Page() {
  return (
    <Shell>
      <Shell.Section>
        <Section
          title="Contact Support"
          description="Get in touch with us to discuss your project, ask a question, or simply to say hello."
        >
          <h1>{'Page'}</h1>
        </Section>
      </Shell.Section>
    </Shell>
  )
}
