'use client'

import type React from 'react'
import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { X } from 'lucide-react'

interface WarehouseFormProps {
  onWarehouseAdded?: (warehouse: Warehouse) => void
}
// Centralized inventory state management
export interface Warehouse {
  id: string
  name: string
  location: string
  createdAt: Date
}

export interface InventoryRecord {
  id: string
  variantId: string
  variantName: string
  warehouseId: string
  warehouseName: string
  quantity: number
  reserved: number
  updatedAt: Date
}

// In-memory storage (replace with database later)
let warehouses: Warehouse[] = [
  {
    id: 'wh-1',
    name: 'Main Warehouse',
    location: 'New York',
    createdAt: new Date(),
  },
  {
    id: 'wh-2',
    name: 'Secondary Warehouse',
    location: 'Los Angeles',
    createdAt: new Date(),
  },
]

let inventoryRecords: InventoryRecord[] = []

export const warehouseStore = {
  getWarehouses: () => warehouses,
  addWarehouse: (warehouse: Warehouse) => {
    warehouses.push(warehouse)
    return warehouse
  },
  updateWarehouse: (id: string, updates: Partial<Warehouse>) => {
    warehouses = warehouses.map((w) => (w.id === id ? { ...w, ...updates } : w))
  },
  deleteWarehouse: (id: string) => {
    warehouses = warehouses.filter((w) => w.id !== id)
    // Also remove inventory records for this warehouse
    inventoryRecords = inventoryRecords.filter((i) => i.warehouseId !== id)
  },
}

export const inventoryStore = {
  getInventory: () => inventoryRecords,
  getInventoryByWarehouse: (warehouseId: string) => inventoryRecords.filter((i) => i.warehouseId === warehouseId),
  getInventoryByVariant: (variantId: string) => inventoryRecords.filter((i) => i.variantId === variantId),
  addInventory: (record: InventoryRecord) => {
    inventoryRecords.push(record)
    return record
  },
  updateInventory: (id: string, updates: Partial<InventoryRecord>) => {
    inventoryRecords = inventoryRecords.map((i) => (i.id === id ? { ...i, ...updates } : i))
  },
  deleteInventory: (id: string) => {
    inventoryRecords = inventoryRecords.filter((i) => i.id !== id)
  },
  adjustQuantity: (id: string, quantityChange: number) => {
    inventoryRecords = inventoryRecords.map((i) => (i.id === id ? { ...i, quantity: i.quantity + quantityChange } : i))
  },
  reserveInventory: (id: string, reservedChange: number) => {
    inventoryRecords = inventoryRecords.map((i) =>
      i.id === id && i.reserved + reservedChange <= i.quantity ? { ...i, reserved: i.reserved + reservedChange } : i,
    )
  },
}

export default function WarehouseForm({ onWarehouseAdded }: WarehouseFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
  })

  const [warehouses, setWarehouses] = useState<Warehouse[]>(warehouseStore.getWarehouses())

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.location.trim()) {
      alert('Please fill in all fields')
      return
    }

    const newWarehouse: Warehouse = {
      id: `wh-${Date.now()}`,
      name: formData.name,
      location: formData.location,
      createdAt: new Date(),
    }

    warehouseStore.addWarehouse(newWarehouse)
    setWarehouses([...warehouses, newWarehouse])
    onWarehouseAdded?.(newWarehouse)

    setFormData({ name: '', location: '' })
  }

  const handleDeleteWarehouse = (id: string) => {
    if (confirm('Are you sure you want to delete this warehouse?')) {
      warehouseStore.deleteWarehouse(id)
      setWarehouses(warehouses.filter((w) => w.id !== id))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Warehouse Management</CardTitle>
        <CardDescription>Add and manage warehouses for inventory storage</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Warehouse Name *</label>
              <Input
                placeholder="e.g., Main Warehouse"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Location *</label>
              <Input
                placeholder="e.g., New York"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                required
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Add Warehouse
          </Button>
        </form>

        {/* Warehouses List */}
        <div className="mt-6 border-t border-slate-200 pt-6">
          <h3 className="mb-4 font-semibold text-slate-900">Existing Warehouses</h3>
          <div className="space-y-2">
            {warehouses.length === 0 ? (
              <p className="text-sm text-slate-500">No warehouses added yet</p>
            ) : (
              warehouses.map((warehouse) => (
                <div
                  key={warehouse.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
                >
                  <div>
                    <p className="font-medium text-slate-900">{warehouse.name}</p>
                    <p className="text-sm text-slate-500">{warehouse.location}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteWarehouse(warehouse.id)}
                    className="rounded p-1 text-red-600 hover:bg-red-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
