'use client'

import { signIn, useSession } from '@/core/auth/auth.client'
import { Button } from '@/shared/components/ui/button'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function PasskeyButton() {
  const router = useRouter()
  const { refetch } = useSession()

  useEffect(() => {
    void signIn.passkey(
      { autoFill: true },
      {
        onSuccess() {
          refetch()
          router.push('/')
        },
      },
    )
  }, [router, refetch])

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={() =>
        void signIn.passkey(undefined, {
          onSuccess() {
            refetch()
            router.push('/')
          },
        })
      }
    >
      Use Passkey
    </Button>
  )
}
