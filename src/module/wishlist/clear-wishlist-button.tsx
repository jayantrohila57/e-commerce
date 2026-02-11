'use client'

import { apiClient } from '@/core/api/api.client'
import { Button } from '@/shared/components/ui/button'
import { Spinner } from '@/shared/components/ui/spinner'
import { debugError } from '@/shared/utils/lib/logger.utils'
import { Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { toast } from 'sonner'

export default function ClearWishlistButton() {
  const [isLoading, startTransition] = useTransition()
  const clear = apiClient.wishlist.clear.useMutation()
  const router = useRouter()
  const utils = apiClient.useUtils()

  const handleClear = () => {
    startTransition(async () => {
      const toastId = toast.loading('Clearing wishlist')
      try {
        await clear.mutateAsync({})
        toast.success('Wishlist cleared', { id: toastId })
        await utils.wishlist.getUserWishlist.invalidate()
        router.refresh()
      } catch (err) {
        debugError('CLEAR_WISHLIST', err)
        toast.error('Failed to clear', { id: toastId })
      }
    })
  }

  return (
    <Button
      onClick={handleClear}
      size="sm"
      variant="destructive"
    >
      {isLoading ? <Spinner className="h-4 w-4" /> : <Trash className="h-4 w-4" />}
      {isLoading ? 'Clearing' : 'Clear all'}
    </Button>
  )
}
