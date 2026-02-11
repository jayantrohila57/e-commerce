'use client'

import { apiClient } from '@/core/api/api.client'
import { Button } from '@/shared/components/ui/button'
import { Spinner } from '@/shared/components/ui/spinner'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip'
import { debugError } from '@/shared/utils/lib/logger.utils'
import { Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { toast } from 'sonner'

interface Props {
  id?: string
  variantId?: string
}

export default function RemoveWishlistItemButton({ id, variantId }: Props) {
  const [isLoading, startTransition] = useTransition()
  const remove = apiClient.wishlist.removeItem.useMutation()
  const utils = apiClient.useUtils()
  const router = useRouter()

  const handleRemove = () => {
    startTransition(async () => {
      const toastId = toast.loading('Removing from wishlist')
      try {
        await remove.mutateAsync({ params: { id, variantId } })
        toast.success('Removed from wishlist', { id: toastId })
        await utils.wishlist.getUserWishlist.invalidate()
        router.refresh()
      } catch (err) {
        debugError('REMOVE_WISHLIST_ITEM', err)
        toast.error('Failed to remove', { id: toastId })
      }
    })
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleRemove}
            size="icon"
            variant="outline"
            className="text-destructive"
            disabled={isLoading}
          >
            {isLoading ? <Spinner className="h-4 w-4" /> : <Trash className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p id="wishlist-tooltip">{'Remove item from your wishlist'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
