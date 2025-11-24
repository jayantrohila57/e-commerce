'use client'

import { LogOut, Loader } from 'lucide-react'
import { useTransition } from 'react'
import { toast } from 'sonner'

import { Button } from '@/shared/components/ui/button'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/shared/components/ui/tooltip'
import { PATH } from '@/shared/config/routes'
import { debugError } from '@/shared/utils/lib/logger.utils'
import { signOut } from '@/core/auth/auth.client'
import { useRouter } from 'next/navigation'

interface SignOutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function SignOutIcon({ variant = 'outline', size = 'icon' }: SignOutButtonProps) {
  const [isLoading, startTransition] = useTransition()

  const router = useRouter()

  const handleSignOut = () => {
    startTransition(async () => {
      const toastId = toast.loading('Signing Out')
      try {
        await signOut()
        toast.success('Signed Out', { id: toastId })
        router.push(PATH.SITE.ROOT)
      } catch (error) {
        debugError('SIGNOUT ERROR', { error })
        toast.error('Failed to Sign Out', { id: toastId })
      }
    })
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={handleSignOut}
          disabled={isLoading}
          variant={variant}
          size={size}
        >
          {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Sign Out</p>
      </TooltipContent>
    </Tooltip>
  )
}
