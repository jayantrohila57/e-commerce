'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Plus, X } from 'lucide-react'

interface SubcategoryFormProps {
  initialData?: { name: string; attributes: string[] }
  onSubmit: (data: { name: string; attributes: string[] }) => void
  onCancel: () => void
}

export default function SubcategoryForm({ initialData, onSubmit, onCancel }: SubcategoryFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    attributes: initialData?.attributes || [],
  })
  const [newAttribute, setNewAttribute] = useState('')

  const handleAddAttribute = () => {
    if (newAttribute.trim() && !formData.attributes.includes(newAttribute.trim())) {
      setFormData({
        ...formData,
        attributes: [...formData.attributes, newAttribute.trim()],
      })
      setNewAttribute('')
    }
  }

  const handleRemoveAttribute = (attribute: string) => {
    setFormData({
      ...formData,
      attributes: formData.attributes.filter((a) => a !== attribute),
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name.trim() && formData.attributes.length > 0) {
      onSubmit(formData)
      setFormData({ name: '', attributes: [] })
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div>
        <label className="text-foreground mb-2 block text-sm font-medium">Subcategory Name *</label>
        <Input
          placeholder="Enter subcategory name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="text-foreground mb-2 block text-sm font-medium">Variant Attributes *</label>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Enter attribute name (e.g., Color, Size, Storage)"
              value={newAttribute}
              onChange={(e) => setNewAttribute(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddAttribute()
                }
              }}
            />
            <Button
              type="button"
              onClick={handleAddAttribute}
              variant="outline"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {formData.attributes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.attributes.map((attr) => (
                <div
                  key={attr}
                  className="bg-primary text-primary-foreground flex items-center gap-2 rounded-full px-3 py-1 text-sm"
                >
                  {attr}
                  <button
                    type="button"
                    onClick={() => handleRemoveAttribute(attr)}
                    className="hover:opacity-80"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!formData.name.trim() || formData.attributes.length === 0}
        >
          Save Subcategory
        </Button>
      </div>
    </form>
  )
}
