'use client'

import { useRouter } from 'next/navigation'
import { revokeOtherSessions } from '@/core/auth/auth.client'
import { Button } from '@/shared/components/ui/button'

export function RevokeSessionButton() {
  const router = useRouter()
  function handleRevokeOtherSessions() {
    void revokeOtherSessions(undefined, {
      onSuccess: () => {
        router.refresh()
      },
    })
  }
  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleRevokeOtherSessions}
    >
      Sign Out All
    </Button>
  )
}
