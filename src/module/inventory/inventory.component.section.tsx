import { FormSection } from '@/shared/components/form/form.helper'
import { PATH } from '@/shared/config/routes'
import { InventoryCard } from './inventory.component.card'

type Inventory = {
  id: string
  sku: string
  barcode?: string | null
  quantity: number
  incoming: number
  reserved: number
}

const InventoryGroup = ({
  title,
  description,
  inventories,
  emptyMessage = 'No inventories',
}: {
  title: string
  description: string
  inventories: Inventory[]
  emptyMessage?: string
}) => (
  <FormSection
    title={title + ` (${inventories?.length ?? 0})`}
    description={description}
  >
    <div className="grid grid-cols-1 gap-2">
      {inventories?.length ? (
        inventories.map((item) => (
          <InventoryCard
            key={item.id}
            inventory={item}
            href={PATH.STUDIO.INVENTORY.SLUG(item.id)}
          />
        ))
      ) : (
        <p className="text-muted-foreground px-2 text-sm">{emptyMessage}</p>
      )}
    </div>
  </FormSection>
)

export function InventorySection({ data }: { data: Inventory[] | null }) {
  const inventories = data ?? []

  return (
    <div className="flex flex-col gap-2">
      <InventoryGroup
        title="All Inventories"
        description="All inventory items across variants"
        inventories={inventories}
        emptyMessage="No inventory available"
      />
    </div>
  )
}

export default InventorySection
