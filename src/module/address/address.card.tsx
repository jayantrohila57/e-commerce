'use client'

import { Badge } from '@/shared/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import AddressDelete from './address.delete'
import EditAddressDialog from './address.edit-dialog'
import SetDefaultAddressButton from './address.set-default'
import type { ShippingAddress } from './address.types'

export default function AddressCard({ address }: { address: ShippingAddress }) {
  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">{address.name}</CardTitle>
          <div className="flex items-center gap-2">
            {address.isDefault ? (
              <Badge variant="secondary">Default</Badge>
            ) : (
              <SetDefaultAddressButton
                id={String(address.id)}
                isDefault={address.isDefault}
              />
            )}
            <EditAddressDialog address={address} />
            <AddressDelete id={String(address.id)} />
          </div>
        </div>
        <div className="text-muted-foreground text-sm">{address.phone}</div>
      </CardHeader>
      <CardContent>
        <div className="text-sm">
          <div>{address.street}</div>
          <div>
            {address.city}, {address.state} {address.postalCode}
          </div>
          <div>{address.country}</div>
        </div>
      </CardContent>
    </Card>
  )
}
