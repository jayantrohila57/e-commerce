'use client'

import type React from 'react'
import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
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
interface InventoryFormProps {
  onInventoryAdded?: (record: InventoryRecord) => void
}
// This allows the product form to access the same category data

export interface CategoryAttribute {
  id: string
  name: string
  attributes: string[]
}

export interface Category {
  id: string
  name: string
  description: string
  subcategories: CategoryAttribute[]
}

// Default categories - can be replaced with API call
export const defaultCategories: Category[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Electronic devices and gadgets',
    subcategories: [
      { id: 'phones', name: 'Phones', attributes: ['Color', 'Storage', 'RAM', 'Processor'] },
      { id: 'laptops', name: 'Laptops', attributes: ['Color', 'Storage', 'RAM', 'Processor'] },
      { id: 'accessories', name: 'Accessories', attributes: ['Color', 'Type', 'Compatibility'] },
    ],
  },
  {
    id: 'fashion',
    name: 'Fashion',
    description: 'Clothing and accessories',
    subcategories: [
      { id: 'men', name: 'Men', attributes: ['Size', 'Color', 'Material', 'Fit'] },
      { id: 'women', name: 'Women', attributes: ['Size', 'Color', 'Material', 'Fit'] },
      { id: 'kids', name: 'Kids', attributes: ['Size', 'Color', 'Material', 'Age Group'] },
    ],
  },
  {
    id: 'home',
    name: 'Home & Garden',
    description: 'Home and garden products',
    subcategories: [
      { id: 'furniture', name: 'Furniture', attributes: ['Size', 'Color', 'Material', 'Style'] },
      { id: 'decor', name: 'Decor', attributes: ['Size', 'Color', 'Material', 'Style'] },
      { id: 'kitchen', name: 'Kitchen', attributes: ['Size', 'Color', 'Material', 'Type'] },
    ],
  },
]

export function getSubcategoriesForCategory(categoryId: string): CategoryAttribute[] {
  const category = defaultCategories.find((c) => c.id === categoryId)
  return category?.subcategories || []
}

export function getAttributesForSubcategory(categoryId: string, subcategoryId: string): string[] {
  const category = defaultCategories.find((c) => c.id === categoryId)
  const subcategory = category?.subcategories.find((s) => s.id === subcategoryId)
  return subcategory?.attributes || []
}

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

export default function InventoryForm({ onInventoryAdded }: InventoryFormProps) {
  const [formData, setFormData] = useState({
    variantId: '',
    variantName: '',
    warehouseId: '',
    quantity: '',
    reserved: '0',
  })

  const warehouses = warehouseStore.getWarehouses()
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSubcategory, setSelectedSubcategory] = useState('')

  const categories = defaultCategories
  const subcategories = categories.find((c) => c.id === selectedCategory)?.subcategories || []

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.variantId.trim() ||
      !formData.variantName.trim() ||
      !formData.warehouseId ||
      !formData.quantity ||
      !warehouses.find((w) => w.id === formData.warehouseId)
    ) {
      alert('Please fill in all required fields')
      return
    }

    const warehouse = warehouses.find((w) => w.id === formData.warehouseId)
    if (!warehouse) return

    const newRecord: InventoryRecord = {
      id: `inv-${new Date.now()}`,
      variantId: formData.variantId,
      variantName: formData.variantName,
      warehouseId: formData.warehouseId,
      warehouseName: warehouse.name,
      quantity: Number(formData.quantity),
      reserved: Number(formData.reserved) || 0,
      updatedAt: new Date(),
    }

    inventoryStore.addInventory(newRecord)
    onInventoryAdded?.(newRecord)

    setFormData({
      variantId: '',
      variantName: '',
      warehouseId: '',
      quantity: '',
      reserved: '0',
    })
    setSelectedCategory('')
    setSelectedSubcategory('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Inventory</CardTitle>
        <CardDescription>Add product inventory to warehouses</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Category</label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem
                      key={cat.id}
                      value={cat.id}
                    >
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Subcategory</label>
              <Select
                value={selectedSubcategory}
                onValueChange={setSelectedSubcategory}
                disabled={!selectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {subcategories.map((subcat) => (
                    <SelectItem
                      key={subcat.id}
                      value={subcat.id}
                    >
                      {subcat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Variant ID *</label>
              <Input
                placeholder="e.g., VAR-001"
                value={formData.variantId}
                onChange={(e) => handleInputChange('variantId', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Variant Name *</label>
              <Input
                placeholder="e.g., Red Size L"
                value={formData.variantName}
                onChange={(e) => handleInputChange('variantName', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Warehouse *</label>
              <Select
                value={formData.warehouseId}
                onValueChange={(v) => handleInputChange('warehouseId', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((wh) => (
                    <SelectItem
                      key={wh.id}
                      value={wh.id}
                    >
                      {wh.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Quantity *</label>
              <Input
                type="number"
                placeholder="0"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                min="0"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Reserved</label>
              <Input
                type="number"
                placeholder="0"
                value={formData.reserved}
                onChange={(e) => handleInputChange('reserved', e.target.value)}
                min="0"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Add Inventory
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
