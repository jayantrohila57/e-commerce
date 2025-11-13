'use client'

import { Input } from '@/shared/components/ui/input'

interface Variant {
  id: string
  name: string
  attributes: Record<string, string>
  price?: number
  costPrice?: number
  sku?: string
  images: string[]
}

interface PricingSectionProps {
  variant: Variant
  onUpdate: (updates: Partial<Variant>) => void
}

export default function PricingSection({ variant, onUpdate }: PricingSectionProps) {
  const handlePriceChange = (field: 'price' | 'costPrice', value: string) => {
    onUpdate({
      [field]: value ? Number.parseFloat(value) : undefined,
    })
  }

  const profit = variant.price && variant.costPrice ? variant.price - variant.costPrice : 0
  const margin =
    variant.price && variant.costPrice && variant.price > 0 ? ((profit / variant.price) * 100).toFixed(2) : 0

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-900">Pricing</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Cost Price ($)</label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={variant.costPrice || ''}
            onChange={(e) => handlePriceChange('costPrice', e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Selling Price ($) *</label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={variant.price || ''}
            onChange={(e) => handlePriceChange('price', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Profit Display */}
      {variant.price && (
        <div className="grid grid-cols-2 gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div>
            <p className="text-xs text-slate-600">Profit</p>
            <p className="text-lg font-semibold text-slate-900">${profit.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-600">Margin</p>
            <p className="text-lg font-semibold text-slate-900">{margin}%</p>
          </div>
        </div>
      )}
    </div>
  )
}
