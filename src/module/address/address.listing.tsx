import { apiServer } from '@/core/api/api.server'
import AddAddressDialog from './address.add-dialog'
import AddressCard from './address.card'

export const AddressServerList = async () => {
  const { data } = await apiServer.address.getUserAddresses({ query: {} })

  if (!data?.length) {
    return (
      <div className="text-muted-foreground p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>No addresses found.</div>
          <AddAddressDialog />
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex w-full items-center justify-between">
        <div className="text-muted-foreground">{data.length} addresses</div>
        <AddAddressDialog />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((addr) => (
          <AddressCard
            key={addr.id}
            address={addr}
          />
        ))}
      </div>
    </div>
  )
}

export default AddressServerList
