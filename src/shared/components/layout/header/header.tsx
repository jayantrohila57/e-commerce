import { HeaderActions } from './header.actions'
import HeaderLogo from './header.logo'

export default function Header() {
  return (
    <nav className="max-w-9xl z-9999 container mx-auto flex h-full w-full items-center justify-between">
      <div className="flex flex-row items-center gap-8">
        <HeaderLogo />
      </div>
      <HeaderActions />
    </nav>
  )
}
