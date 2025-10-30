import { HeaderActions } from './header.actions'
import HeaderLogo from './header.logo'
import { getServerSession } from '@/core/auth/auth.server'

export default async function Header() {
  const { session, user } = await getServerSession()
  return (
    <nav className="max-w-9xl z-9999 container mx-auto flex h-full w-full items-center justify-between">
      <div className="flex flex-row items-center gap-8">
        <HeaderLogo />
      </div>
      <HeaderActions
        session={session}
        user={user}
      />
    </nav>
  )
}
