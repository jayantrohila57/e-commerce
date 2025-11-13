import { LegalSidebar } from '@/module/legal/components/legal.sidebar'
import Section from '@/shared/components/layout/section/section'
import Shell from '@/shared/components/layout/shell'

export const metadata = {
  title: 'Legal',
  description: 'Get help with any issues or questions you may have.',
}

export default function Page() {
  return (
    <Shell>
      <Section
        className="bg-muted p-4"
        {...metadata}
      >
        <div className="grid h-full w-full grid-cols-12 gap-4">
          <div className="col-span-2 h-full w-full">
            <LegalSidebar activeSection={'legal'} />
          </div>
          <div className="col-span-10 h-full w-full"></div>
        </div>
      </Section>
    </Shell>
  )
}
