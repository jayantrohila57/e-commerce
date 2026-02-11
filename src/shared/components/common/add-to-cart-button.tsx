'use client'

import { apiClient } from '@/core/api/api.client'
import { Button } from '@/shared/components/ui/button'
import { debugError } from '@/shared/utils/lib/logger.utils'
import { Loader, ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

interface Props {
  variantId: string
  wishlistId?: string
  initialInCart?: boolean
}

export default function AddToCartButton({ variantId, wishlistId, initialInCart }: Props) {
  const [isLoading, startTransition] = useTransition()
  const [inCart, setInCart] = useState<boolean>(!!initialInCart)
  const router = useRouter()

  const addToCartMutation = apiClient.cart.addItem.useMutation()
  const removeFromWishlistMutation = apiClient.wishlist.removeItem.useMutation()

  const handleClick = () => {
    startTransition(async () => {
      const toastId = toast.loading(inCart ? 'Removing from cart' : 'Adding to cart')
      try {
        if (!inCart) {
          await addToCartMutation.mutateAsync({ body: { variantId, quantity: 1 } })

          // optionally remove from wishlist if this button is used inside wishlist
          if (wishlistId) {
            try {
              await removeFromWishlistMutation.mutateAsync({ params: { id: wishlistId } })
            } catch (e) {
              debugError('ADD_TO_CART:REMOVE_FROM_WISHLIST:ERROR', e)
            }
          }

          toast.success('Added to cart', { id: toastId })
          setInCart(true)
        } else {
          // remove from cart
          toast.success('Removed from cart', { id: toastId })
          setInCart(false)
        }

        // refresh page to let other components reflect change
        try {
          router.refresh()
        } catch (err) {
          debugError('ADD_TO_CART:ERROR', { err })
        }
      } catch (error) {
        debugError('ADD_TO_CART:ERROR', { error })
        toast.error('Failed', { id: toastId })
      }
    })
  }

  return (
    <Button
      onClick={handleClick}
      size="lg"
      variant="outline"
    >
      {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}
      {isLoading ? (inCart ? 'Removing' : 'Adding') : inCart ? 'Remove' : 'Add to cart'}
    </Button>
  )
}
