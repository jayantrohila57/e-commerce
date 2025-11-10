'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Trash2, Edit2 } from 'lucide-react'
// Centralized inventory state management
export interface Warehouse {
  id: string
  name: string
  location: string
  createdAt: Date
}
interface InventoryTableProps {
  refreshTrigger?: number
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

export default function InventoryTable({ refreshTrigger }: InventoryTableProps) {
  const [inventory, setInventory] = useState<InventoryRecord[]>([])
  const [filteredInventory, setFilteredInventory] = useState<InventoryRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Partial<InventoryRecord>>({})

  useEffect(() => {
    const allInventory = inventoryStore.getInventory()
    setInventory(allInventory)
    setFilteredInventory(allInventory)
  }, [refreshTrigger])

  useEffect(() => {
    const filtered = inventory.filter(
      (item) =>
        item.variantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.variantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.warehouseName.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredInventory(filtered)
  }, [searchTerm, inventory])

  const handleEdit = (record: InventoryRecord) => {
    setEditingId(record.id)
    setEditValues({
      quantity: record.quantity,
      reserved: record.reserved,
    })
  }

  const handleSaveEdit = (id: string) => {
    inventoryStore.updateInventory(id, {
      quantity: editValues.quantity || 0,
      reserved: editValues.reserved || 0,
      updatedAt: new Date(),
    })

    setInventory(inventoryStore.getInventory())
    setEditingId(null)
    setEditValues({})
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this inventory record?')) {
      inventoryStore.deleteInventory(id)
      setInventory(inventoryStore.getInventory())
    }
  }

  const handleAdjustQuantity = (id: string, change: number) => {
    const record = inventory.find((i) => i.id === id)
    if (record) {
      const newQuantity = record.quantity + change
      if (newQuantity >= 0) {
        inventoryStore.updateInventory(id, {
          quantity: newQuantity,
          updatedAt: new Date(),
        })
        setInventory(inventoryStore.getInventory())
      }
    }
  }

  const totalQuantity = filteredInventory.reduce((sum, item) => sum + item.quantity, 0)
  const totalReserved = filteredInventory.reduce((sum, item) => sum + item.reserved, 0)
  const totalAvailable = totalQuantity - totalReserved

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Table</CardTitle>
        <CardDescription>View and manage product inventory across warehouses</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Input
            placeholder="Search by variant name, ID, or warehouse..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm font-medium text-blue-600">Total Quantity</p>
            <p className="text-2xl font-bold text-blue-900">{totalQuantity}</p>
          </div>
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <p className="text-sm font-medium text-yellow-600">Reserved</p>
            <p className="text-2xl font-bold text-yellow-900">{totalReserved}</p>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="text-sm font-medium text-green-600">Available</p>
            <p className="text-2xl font-bold text-green-900">{totalAvailable}</p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Variant Name</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Variant ID</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Warehouse</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-900">Quantity</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-900">Reserved</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-900">Available</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    No inventory records found
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-200 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 font-medium text-slate-900">{item.variantName}</td>
                    <td className="px-4 py-3 text-slate-700">{item.variantId}</td>
                    <td className="px-4 py-3 text-slate-700">{item.warehouseName}</td>
                    <td className="px-4 py-3 text-center">
                      {editingId === item.id ? (
                        <Input
                          type="number"
                          value={editValues.quantity}
                          onChange={(e) => setEditValues({ ...editValues, quantity: Number(e.target.value) })}
                          min="0"
                          className="mx-auto w-16"
                        />
                      ) : (
                        <span className="font-semibold">{item.quantity}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {editingId === item.id ? (
                        <Input
                          type="number"
                          value={editValues.reserved}
                          onChange={(e) => setEditValues({ ...editValues, reserved: Number(e.target.value) })}
                          min="0"
                          className="mx-auto w-16"
                        />
                      ) : (
                        <span className="font-medium text-yellow-600">{item.reserved}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-medium text-green-600">{item.quantity - item.reserved}</span>
                    </td>
                    <td className="space-x-2 px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        {editingId === item.id ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSaveEdit(item.id)}
                              className="border-green-200 bg-green-50 text-green-600 hover:bg-green-100"
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingId(null)}
                              className="bg-slate-100 hover:bg-slate-200"
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(item)}
                              className="border-blue-200 text-blue-600 hover:bg-blue-50"
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(item.id)}
                              className="border-red-200 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pt-4">
          <button
            onClick={() => {
              const jsonOutput = {
                timestamp: new Date().toISOString(),
                summary: {
                  totalRecords: filteredInventory.length,
                  totalQuantity,
                  totalReserved,
                  totalAvailable,
                },
                data: filteredInventory,
              }
              console.log('Inventory Data:')
              console.log(JSON.stringify(jsonOutput, null, 2))
              alert('Inventory data logged to console!')
            }}
            className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-300"
          >
            Export to Console (JSON)
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
