'use client'

import { apiClient } from '@/core/api/api.client'
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
import { Button } from '@/shared/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/ui/tooltip'
import { STATUS } from '@/shared/config/api.config'
import { PATH } from '@/shared/config/routes'
import { Loader, Trash } from 'lucide-react'
import { Route } from 'next'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface InventoryDeleteProps {
  inventoryId: string
}

export function InventoryDelete({ inventoryId }: InventoryDeleteProps) {
  const router = useRouter()
  const [toastId, setToastId] = useState<string | number>('')

  const deleteInventory = apiClient.inventory.delete.useMutation({
    onSuccess: async ({ status, message }) => {
      if (status === STATUS.SUCCESS) {
        toast.success(message, { id: toastId })
        setToastId('')
        router.push(PATH.STUDIO.INVENTORY.ROOT as Route)
      } else if (status === STATUS.FAILED || status === STATUS.ERROR) {
        toast.error(message, { id: toastId })
        setToastId('')
      }
    },
    onError: ({ message }) => {
      toast.error(message || 'An error occurred while deleting the inventory', { id: toastId })
      setToastId('')
    },
  })

  const handleDelete = () => {
    const id = toast.loading('Deleting inventory...')
    setToastId(id)
    deleteInventory.mutate({ params: { id: String(inventoryId) } })
  }

  return (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button
              disabled={deleteInventory.isPending}
              variant="destructive"
              size="icon"
              className="hover:bg-destructive/90"
            >
              {deleteInventory.isPending ? <Loader className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete Inventory</p>
        </TooltipContent>
      </Tooltip>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this inventory item?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteInventory.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteInventory.isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default InventoryDelete
