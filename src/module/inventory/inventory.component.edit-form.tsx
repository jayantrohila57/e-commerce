'use client'

import { apiClient } from '@/core/api/api.client'
import Form from '@/shared/components/form/form'
import { FormSection } from '@/shared/components/form/form.helper'
import { Button } from '@/shared/components/ui/button'
import { Separator } from '@/shared/components/ui/separator'
import { STATUS } from '@/shared/config/api.config'
import { PATH } from '@/shared/config/routes'
import { type Route } from 'next'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import type { z } from 'zod/v3'
import { inventoryContract } from './inventory.schema'

const formSchema = inventoryContract.update.input
type FormValues = z.infer<typeof formSchema>

export default function InventoryEditForm({ inventory }: { inventory: Record<string, unknown> | null }) {
  const router = useRouter()
  const [toastId, setToastId] = useState<string | number>('')

  const updateInventory = apiClient.inventory.update.useMutation({
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
      toast.error(message || 'An error occurred while updating the inventory', { id: toastId })
      setToastId('')
    },
  })

  function onSubmit(data: FormValues) {
    if (!inventory) {
      toast.error('Inventory not found')
      return
    }

    setToastId('')
    const id = toast.loading('Updating inventory')
    setToastId(id)

    updateInventory.mutate({
      params: { id: String(inventory?.id) },
      data: {
        sku: data?.data?.sku,
        barcode: data?.data?.barcode ?? null,
        quantity: data?.data?.quantity,
        incoming: data?.data?.incoming,
        reserved: data?.data?.reserved,
      },
    })
  }

  return (
    <Form
      defaultValues={{
        params: { id: String(inventory?.id) },
        data: { ...inventory },
      }}
      schema={formSchema}
      onSubmitAction={onSubmit}
      className="grid h-full grid-cols-4 gap-1 pb-20"
    >
      <div className="col-span-4 h-full w-full">
        <FormSection
          title="Inventory Details"
          description="Edit inventory details"
        >
          <Form.Field
            name="data.sku"
            label="SKU"
            type="text"
            required
            placeholder="SKU"
          />
          <Form.Field
            name="data.barcode"
            label="Barcode"
            type="text"
            placeholder="Barcode"
          />
          <Form.Field
            name="data.quantity"
            label="Quantity"
            type="number"
            required
            placeholder="Quantity"
          />
          <Form.Field
            name="data.incoming"
            label="Incoming"
            type="number"
            placeholder="Incoming"
          />
          <Form.Field
            name="data.reserved"
            label="Reserved"
            type="number"
            placeholder="Reserved"
          />
        </FormSection>
      </div>

      <Separator className="col-span-4 mt-4" />

      <div className="col-span-4 flex h-auto w-full flex-row items-center justify-between gap-x-4 p-0 py-4">
        <Form.StatusBadge />
        <div className="flex flex-row items-center gap-2">
          <Button
            variant="outline"
            type="button"
          >
            Save Draft
          </Button>
          <Form.Submit
            disabled={updateInventory.isPending}
            isLoading={updateInventory.isPending}
          />
        </div>
      </div>
    </Form>
  )
}
