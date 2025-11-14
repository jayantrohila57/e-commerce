'use client'

import { Trash, Loader } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Button } from '@/shared/components/ui/button'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/shared/components/ui/tooltip'
import { PATH } from '@/shared/config/routes'
import { apiClient } from '@/core/api/api.client'
import { STATUS } from '@/shared/config/api.config'
import { Route } from 'next'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/components/ui/alert-dialog'

interface ProductDeleteProps {
  productId: string
}

export function ProductDelete({ productId }: ProductDeleteProps) {
  const router = useRouter()
  const [toastId, setToastId] = useState<string | number>('')

  const deleteProduct = apiClient.product.delete.useMutation({
    onSuccess: async ({ status, message }) => {
      if (status === STATUS.SUCCESS) {
        toast.success(message, { id: toastId })
        setToastId('')
        router.push(PATH.STUDIO.PRODUCTS.ROOT as Route)
      } else if (status === STATUS.FAILED || status === STATUS.ERROR) {
        toast.error(message, { id: toastId })
        setToastId('')
      }
    },
    onError: ({ message }) => {
      toast.error(message || 'An error occurred while deleting the product', { id: toastId })
      setToastId('')
    },
  })

  const handleDelete = () => {
    const id = toast.loading('Deleting product...')
    setToastId(id)
    deleteProduct.mutate({
      params: {
        id: productId,
      },
    })
  }

  return (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button
              disabled={deleteProduct.isPending}
              variant="destructive"
              size="icon"
              className="hover:bg-destructive/90"
            >
              {deleteProduct.isPending ? <Loader className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete Product</p>
        </TooltipContent>
      </Tooltip>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this product?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. All product data will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteProduct.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteProduct.isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
