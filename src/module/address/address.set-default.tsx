'use client'

import { apiClient } from '@/core/api/api.client'
import { Button } from '@/shared/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/ui/tooltip'
import { STATUS } from '@/shared/config/api.config'
import { Check, Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export default function SetDefaultAddressButton({ id, isDefault }: { id: string; isDefault?: boolean }) {
  const router = useRouter()
  const [toastId, setToastId] = useState<string | number>('')

  const setDefault = apiClient.address.setDefault.useMutation({
    onSuccess: async ({ status, message }) => {
      if (status === STATUS.SUCCESS) {
        toast.success(message, { id: toastId })
        setToastId('')
        await router.refresh()
      } else {
        toast.error(message, { id: toastId })
        setToastId('')
      }
    },
    onError: ({ message }) => {
      toast.error(message || 'An error occurred while updating default', { id: toastId })
      setToastId('')
    },
  })

  const onSetDefault = () => {
    if (isDefault) return
    const idToast = toast.loading('Making default...')
    setToastId(idToast)
    setDefault.mutate({ params: { id } })
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={onSetDefault}
          size="icon"
          variant={isDefault ? 'default' : 'default'}
        >
          {setDefault.isPending ? <Loader className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{isDefault ? 'Default address' : 'Set default address'}</p>
      </TooltipContent>
    </Tooltip>
  )
}
