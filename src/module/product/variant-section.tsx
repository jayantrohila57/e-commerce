'use client'

import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { Trash2 } from 'lucide-react'

interface Variant {
  id: string
  name: string
  attributes: Record<string, string>
  price?: number
  costPrice?: number
  sku?: string
  images: string[]
}

interface VariantSectionProps {
  variant: Variant
  attributeOptions: string[]
  onUpdate: (updates: Partial<Variant>) => void
  onRemove: () => void
}

export default function VariantSection({ variant, attributeOptions, onUpdate, onRemove }: VariantSectionProps) {
  const handleAttributeChange = (key: string, value: string) => {
    onUpdate({
      attributes: {
        ...variant.attributes,
        [key]: value,
      },
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div className="flex-1">
          <label className="mb-2 block text-sm font-medium text-slate-700">Variant Name</label>
          <Input
            placeholder="e.g., Red 256GB, Large Blue"
            value={variant.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
          />
        </div>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={onRemove}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">SKU</label>
        <Input
          placeholder="Enter SKU"
          value={variant.sku || ''}
          onChange={(e) => onUpdate({ sku: e.target.value })}
        />
      </div>

      {/* Attributes */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-700">Attributes</label>
        {attributeOptions.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {attributeOptions.map((attr) => (
              <div key={attr}>
                <label className="mb-1 block text-xs text-slate-600">{attr}</label>
                <Input
                  placeholder={`Enter ${attr.toLowerCase()}`}
                  value={variant.attributes[attr] || ''}
                  onChange={(e) => handleAttributeChange(attr, e.target.value)}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">Select a category to see available attributes</p>
        )}
      </div>
    </div>
  )
}
