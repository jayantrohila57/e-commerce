'use client'

import { Button } from '@/shared/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog'
import { PencilIcon } from 'lucide-react'
import { useState } from 'react'
import AddressForm from './address.form'
import type { ShippingAddress } from './address.types'

export default function EditAddressDialog({ address }: { address: ShippingAddress }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
        >
          <PencilIcon />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit address</DialogTitle>
        </DialogHeader>

        <AddressForm
          address={address}
          onSuccess={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
