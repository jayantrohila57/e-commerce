import Section from '@/shared/components/layout/section/section'
import Shell from '@/shared/components/layout/shell'

export default function Page() {
  return (
    <Shell>
      <Shell.Section>
        <Section
          title="Terms and Conditions"
          description="Please read these terms and conditions carefully before using our website."
        >
          <h1>{'Page'}</h1>
        </Section>
      </Shell.Section>
    </Shell>
  )
}
