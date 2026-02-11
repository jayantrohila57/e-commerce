import Header from '@/shared/components/layout/header/header'
import { Shell } from '@/shared/components/layout/shell'
import { PATH } from '@/shared/config/routes'
import Link from 'next/link'

export const metadata = {
  title: 'Forbidden',
  description: 'You are not authorized to access this resource.',
}

export default function Forbidden() {
  return (
    <Shell>
      <Shell.Header>
        <Header />
      </Shell.Header>
      <Shell.Main>
        <Shell.Section {...metadata}>
          <div className="flex h-screen w-full items-center justify-center">
            <div>
              <h2>Forbidden</h2>
              <p>You are not authorized to access this resource.</p>
              <Link href={PATH.ROOT}>Return Home</Link>
            </div>
          </div>
        </Shell.Section>
      </Shell.Main>
    </Shell>
  )
}
