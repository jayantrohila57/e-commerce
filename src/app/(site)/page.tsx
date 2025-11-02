import { getServerSession } from '@/core/auth/auth.server'
import Section from '@/shared/components/layout/section/section'
import Shell from '@/shared/components/layout/shell'

export const metadata = {
  title: 'Home',
  description: 'Home Description',
}

export default async function Home({}: PageProps<'/'>) {
  const { session, user } = await getServerSession()

  return (
    <Shell>
      <Shell.Section>
        <Section {...metadata}>
          <div className="my-6 px-4">
            <div className="space-y-6 text-left">
              {session && <code className="whitespace-pre-wrap">{JSON.stringify({ session, user }, null, 2)}</code>}
            </div>
          </div>
        </Section>
      </Shell.Section>
    </Shell>
  )
}
