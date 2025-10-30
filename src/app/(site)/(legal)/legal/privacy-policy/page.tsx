import Section from '@/shared/components/layout/section/section'
import Shell from '@/shared/components/layout/shell'

export default function Page() {
  return (
    <Shell>
      <Shell.Section>
        <Section
          title="Privacy Policy"
          description="This privacy policy will explain how our organization uses the personal data we collect from you."
        >
          <h1>{'Page'}</h1>
        </Section>
      </Shell.Section>
    </Shell>
  )
}
