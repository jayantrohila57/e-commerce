'use client'

import { Button } from '@/shared/components/ui/button'
import { signOut } from '@/core/auth/auth.client'

export const AuthSignOutButton = () => {
  return (
    <Button
      onClick={() => void signOut()}
      size="lg"
      variant="outline"
    >
      Signout
    </Button>
  )
}
