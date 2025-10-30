import { getServerSession } from '@/core/auth/auth.server'
import Section from '@/shared/components/layout/section/section'
import Shell from '@/shared/components/layout/shell'
import { type NextUrls } from '@/shared/config/next-urls'

export const metadata = {
  title: 'Store',
  description: 'Store Home',
}

export default async function StorePage({ params, searchParams }: PageProps<NextUrls['PRODUCTS']>) {
  const syncParam = await params
  const syncSearchParams = await searchParams
  const { session, user } = await getServerSession()

  return (
    <Shell>
      <Shell.Section>
        <Section
          {...metadata}
          action="Store Action"
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
