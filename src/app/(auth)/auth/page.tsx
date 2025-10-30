import { getServerSession } from '@/core/auth/auth.server'
import Section from '@/shared/components/layout/section/section'
import Shell from '@/shared/components/layout/shell'
import { type NextUrls } from '@/shared/config/next-urls'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Authentication',
  description: 'Authentication Home',
}

export default async function AuthPage({ params, searchParams }: PageProps<NextUrls['AUTH']>) {
  const syncParam = await params
  const syncSearchParams = await searchParams
  const { session, user } = await getServerSession()
  if (session) redirect('/')
  return (
    <Shell>
      <Shell.Section>
        <Section
          {...metadata}
          action="Auth Action"
        >
          <div className="">
            {JSON.stringify({
              session,
              user,
              syncParam,
              syncSearchParams,
            })}
          </div>
        </Section>
      </Shell.Section>
    </Shell>
  )
}
