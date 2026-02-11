'use client'

import { apiClient } from '@/core/api/api.client'
import { useSession } from '@/core/auth/auth.client'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { SlidingNumber } from '@/shared/components/ui/sliding-numbers'
import { Spinner } from '@/shared/components/ui/spinner'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip'
import { PATH } from '@/shared/config/routes'
import { debugError } from '@/shared/utils/lib/logger.utils'
import { cn } from '@/shared/utils/lib/utils'
import { Heart } from 'lucide-react'
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'

interface Props {
  variantId?: string
  initialInWishlist?: boolean
  ariaLabel?: string
}

export default function WishListButton({ variantId, initialInWishlist, ariaLabel = 'Wishlist' }: Props) {
  const router = useRouter()
  const [count, setCount] = useState(0)
  const { data: session } = useSession()

  const utils = apiClient.useUtils()
  const { data } = apiClient.wishlist.getUserWishlist.useQuery({ query: {} }, { enabled: !!session })

  // keep badge in sync with server
  const serverCount = data?.data?.length ?? 0

  // compute presence if a variantId is provided
  const found = data?.data?.find((i) => i.variantId === variantId)
  const initialState = !!initialInWishlist || !!found

  // keep local badge count in sync with server
  useEffect(() => {
    setCount(serverCount)
  }, [serverCount])

  // track whether this variant (when provided) is in wishlist
  const [inWishlist, setInWishlist] = useState<boolean>(initialState)
  useEffect(() => setInWishlist(initialState), [initialState])

  const [, startTransition] = useTransition()
  const addMutation = apiClient.wishlist.addItem.useMutation()
  const removeMutation = apiClient.wishlist.removeItem.useMutation()

  const handleClick = () => {
    // If variantId provided, toggle add/remove
    if (variantId) {
      startTransition(async () => {
        const toastId = toast.loading(inWishlist ? 'Removing from wishlist' : 'Adding to wishlist')
        try {
          if (!inWishlist) {
            await addMutation.mutateAsync({ body: { variantId } })
            setInWishlist(true)
            toast.success('Added to wishlist', { id: toastId })
          } else {
            await removeMutation.mutateAsync({ params: { variantId } })
            setInWishlist(false)
            toast.success('Removed from wishlist', { id: toastId })
          }
          utils.wishlist.getUserWishlist.invalidate({ query: {} })
        } catch (error) {
          debugError('WISHLIST_BUTTON_ERROR', error)
          toast.error('Action failed', { id: toastId })
        }
      })
      return
    }

    // default behaviour: navigate to wishlist page
    router.push(PATH.ACCOUNT.WISHLIST)
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="relative p-0"
            onClick={handleClick}
            disabled={addMutation.isPending || removeMutation.isPending}
            aria-label={ariaLabel}
          >
            {addMutation.isPending || removeMutation.isPending ? (
              <Spinner
                className="h-5 w-5"
                aria-hidden="true"
              />
            ) : (
              <Heart
                aria-hidden="true"
                className={cn('h-5 w-5', inWishlist && 'fill-red-500 stroke-red-500')}
              />
            )}

            {count > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0">
                <motion.div
                  initial={{ y: 0, fontSize: `${10}px` }}
                  animate={{ y: 0, fontSize: `${10}px` }}
                  transition={{
                    ease: [1, 0, 0.35, 0.95],
                    duration: 1.5,
                    delay: 0.5,
                  }}
                >
                  <SlidingNumber
                    className="flex h-5 w-5 items-center justify-center border text-center"
                    value={Number(count)}
                  />
                </motion.div>
              </Badge>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p id="wishlist-tooltip">{'You have ' + serverCount + ' items in your wishlist'}</p>
          {variantId && (
            <p className="text-muted-foreground mt-1 text-xs">
              {inWishlist ? 'Click to remove this item' : 'Click to add this item'}
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
