'use client'

import { useState } from 'react'
import Link from 'next/link'
import WarehouseForm from './warehouse-form'
import InventoryForm from './inventory-form'
import InventoryTable from './inventory-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { PATH } from '@/shared/config/routes'
import { type Route } from 'next'

export default function InventoryPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleInventoryAdded = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <Tabs
      defaultValue="inventory"
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="inventory">Inventory</TabsTrigger>
        <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
        <TabsTrigger value="table">View All</TabsTrigger>
      </TabsList>

      <TabsContent
        value="inventory"
        className="space-y-6"
      >
        <InventoryForm onInventoryAdded={handleInventoryAdded} />
      </TabsContent>

      <TabsContent
        value="warehouses"
        className="space-y-6"
      >
        <WarehouseForm onWarehouseAdded={handleInventoryAdded} />
      </TabsContent>

      <TabsContent
        value="table"
        className="space-y-6"
      >
        <InventoryTable refreshTrigger={refreshTrigger} />
      </TabsContent>
    </Tabs>
  )
}
