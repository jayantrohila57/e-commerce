'use client'

import { apiClient } from '@/core/api/api.client'
import Form from '@/shared/components/form/form'
import { Button } from '@/shared/components/ui/button'
import { Separator } from '@/shared/components/ui/separator'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import type z from 'zod/v3'
import { shippingAddressContract } from './address.schema'
import type { ShippingAddress } from './address.types'

const formSchema = shippingAddressContract.create.input
type CreateFormValues = z.infer<typeof formSchema>

const updateSchema = shippingAddressContract.update.input
type UpdateFormValues = z.infer<typeof updateSchema>

export default function AddressForm({
  address,
  onSuccess,
  onCancel,
}: {
  address?: ShippingAddress | null
  onSuccess?: () => void
  onCancel?: () => void
}) {
  const router = useRouter()
  const [toastId, setToastId] = useState<string | number>('')

  const utils = apiClient.useUtils()

  const create = apiClient.address.create.useMutation({
    onSuccess: async ({ status, message }) => {
      if (status === 'success') {
        toast.success(message, { id: toastId })
        setToastId('')
        // invalidate or refresh
        await utils.address.getUserAddresses.invalidate()
        router.refresh()
        onSuccess?.()
        onSuccess?.()
      } else {
        toast.error(message, { id: toastId })
        setToastId('')
      }
    },
    onError: ({ message }) => {
      toast.error(message || 'An error occurred while creating address', { id: toastId })
      setToastId('')
    },
  })

  const update = apiClient.address.update.useMutation({
    onSuccess: async ({ status, message }) => {
      if (status === 'success') {
        toast.success(message, { id: toastId })
        setToastId('')
        await utils.address.getUserAddresses.invalidate()
        router.refresh()
      } else {
        toast.error(message, { id: toastId })
        setToastId('')
      }
    },
    onError: ({ message }) => {
      toast.error(message || 'An error occurred while updating address', { id: toastId })
      setToastId('')
    },
  })

  function onCreateSubmit(data: CreateFormValues) {
    setToastId('')
    const id = toast.loading('Saving address...')
    setToastId(id)
    create.mutate({ body: data.body })
  }

  function onUpdateSubmit(data: UpdateFormValues) {
    if (!address) return toast.error('Address not found')
    setToastId('')
    const id = toast.loading('Updating address...')
    setToastId(id)
    update.mutate({ params: { id: String(address?.id) }, body: data.body })
  }

  if (address) {
    return (
      <Form
        schema={updateSchema}
        defaultValues={{ params: { id: String(address.id) }, body: { ...address } }}
        onSubmitAction={onUpdateSubmit}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Form.Field
            name="body.name"
            label="Name"
            type="text"
            required
            placeholder="Recipient name"
          />
          <Form.Field
            name="body.phone"
            label="Phone"
            type="text"
            required
            placeholder="Phone"
          />
          <Form.Field
            name="body.street"
            label="Street"
            type="text"
            required
            placeholder="Street"
          />
          <Form.Field
            name="body.city"
            label="City"
            type="text"
            required
            placeholder="City"
          />
          <Form.Field
            name="body.state"
            label="State"
            type="text"
            required
            placeholder="State"
          />
          <Form.Field
            name="body.postalCode"
            label="Postal Code"
            type="text"
            required
            placeholder="Postal code"
          />
          <Form.Field
            name="body.country"
            label="Country"
            type="text"
            required
            placeholder="Country"
          />
          <Form.Field
            name="body.isDefault"
            label="Default Address"
            type="switch"
          />
        </div>

        <Separator className="my-4" />

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            type="button"
            onClick={() => onCancel?.() ?? router.refresh()}
          >
            Cancel
          </Button>
          <Form.Submit
            disabled={update.isPending}
            isLoading={update.isPending}
          />
        </div>
      </Form>
    )
  }

  return (
    <Form
      schema={formSchema}
      defaultValues={{
        body: { name: '', phone: '', street: '', city: '', state: '', postalCode: '', country: '', isDefault: false },
      }}
      onSubmitAction={onCreateSubmit}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Form.Field
          name="body.name"
          label="Name"
          type="text"
          required
          placeholder="Recipient name"
        />
        <Form.Field
          name="body.phone"
          label="Phone"
          type="text"
          required
          placeholder="Phone"
        />
        <Form.Field
          name="body.street"
          label="Street"
          type="text"
          required
          placeholder="Street"
        />
        <Form.Field
          name="body.city"
          label="City"
          type="text"
          required
          placeholder="City"
        />
        <Form.Field
          name="body.state"
          label="State"
          type="text"
          required
          placeholder="State"
        />
        <Form.Field
          name="body.postalCode"
          label="Postal Code"
          type="text"
          required
          placeholder="Postal code"
        />
        <Form.Field
          name="body.country"
          label="Country"
          type="text"
          required
          placeholder="Country"
        />
        <Form.Field
          name="body.isDefault"
          label="Default Address"
          type="switch"
        />
      </div>

      <Separator className="my-4" />

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          type="button"
          onClick={() => onCancel?.() ?? router.refresh()}
        >
          Cancel
        </Button>
        <Form.Submit
          disabled={create.isPending}
          isLoading={create.isPending}
        />
      </div>
    </Form>
  )
}
