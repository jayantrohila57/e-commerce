'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import VariantSection from './variant-section'
import PricingSection from './pricing-section'
import ImageUploadSection from './image-upload-section'
import KeyPointsSection from './key-points-section'
import { Plus } from 'lucide-react'
import { debugLog } from '@/shared/utils/lib/logger.utils'
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

interface Variant {
  id: string
  name: string
  attributes: Record<string, string>
  price?: number
  costPrice?: number
  sku?: string
  images: string[]
}

interface ProductFormData {
  productName: string
  description: string
  category: string
  subcategory: string
  highlights: string
  keyPoints: string[]
  variants: Variant[]
}

export default function ProductForm() {
  const [formData, setFormData] = useState<ProductFormData>({
    productName: '',
    description: '',
    category: '',
    subcategory: '',
    highlights: '',
    keyPoints: [],
    variants: [],
  })

  const [currentVariantId, setCurrentVariantId] = useState<string | null>(null)

  const categories = defaultCategories

  const subcategories = categories.find((c) => c.id === formData.category)?.subcategories || []

  const attributeOptions: Record<string, string[]> = {}
  categories.forEach((cat) => {
    attributeOptions[cat.id] = []
    cat.subcategories.forEach((subcat) => {
      if (subcat.id === formData.subcategory) {
        attributeOptions[cat.id] = subcat.attributes
      }
    })
  })

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddVariant = () => {
    const newVariant: Variant = {
      id: Date.now().toString(),
      name: '',
      attributes: {},
      images: [],
    }
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, newVariant],
    }))
    setCurrentVariantId(newVariant.id)
  }

  const handleUpdateVariant = (variantId: string, updates: Partial<Variant>) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((v) => (v.id === variantId ? { ...v, ...updates } : v)),
    }))
  }

  const handleRemoveVariant = (variantId: string) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((v) => v.id !== variantId),
    }))
    if (currentVariantId === variantId) {
      setCurrentVariantId(null)
    }
  }

  const handleAddKeyPoint = (point: string) => {
    if (point.trim()) {
      setFormData((prev) => ({
        ...prev,
        keyPoints: [...prev.keyPoints, point],
      }))
    }
  }

  const handleRemoveKeyPoint = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      keyPoints: prev.keyPoints.filter((_, i) => i !== index),
    }))
  }

  const handleImagesUpdate = (variantId: string, images: string[]) => {
    handleUpdateVariant(variantId, { images })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const jsonOutput = {
      timestamp: new Date().toISOString(),
      productData: formData,
    }
    debugLog('Product Form Submitted:')
    debugLog(JSON.stringify(jsonOutput, null, 2))
    alert('Product data logged to console! Open DevTools to view.')
  }

  const currentVariant = formData.variants.find((v) => v.id === currentVariantId)

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Product name, description, and category</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Product Name *</label>
            <Input
              placeholder="Enter product name"
              value={formData.productName}
              onChange={(e) => handleInputChange('productName', e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
            <textarea
              placeholder="Enter product description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Category *</label>
              <Select
                value={formData.category}
                onValueChange={(v) => {
                  handleInputChange('category', v)
                  handleInputChange('subcategory', '')
                }}
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
              <label className="mb-2 block text-sm font-medium text-slate-700">Sub Category *</label>
              <Select
                value={formData.subcategory}
                onValueChange={(v) => handleInputChange('subcategory', v)}
              >
                <SelectTrigger disabled={!formData.category}>
                  <SelectValue placeholder="Select sub category" />
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

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Highlights</label>
            <Input
              placeholder="Enter product highlights (e.g., Premium quality, Fast delivery)"
              value={formData.highlights}
              onChange={(e) => handleInputChange('highlights', e.target.value)}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Key Points */}
      <Card>
        <CardHeader>
          <CardTitle>Key Points</CardTitle>
          <CardDescription>Add key features or benefits</CardDescription>
        </CardHeader>
        <CardContent>
          <KeyPointsSection
            keyPoints={formData.keyPoints}
            onAdd={handleAddKeyPoint}
            onRemove={handleRemoveKeyPoint}
          />
        </CardContent>
      </Card>

      {/* Variants Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Product Variants</CardTitle>
            <CardDescription>Add different versions of your product</CardDescription>
          </div>
          <Button
            onClick={handleAddVariant}
            type="button"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Variant
          </Button>
        </CardHeader>
        <CardContent>
          {formData.variants.length === 0 ? (
            <div className="py-8 text-center text-slate-500">
              <p>No variants added yet. Click &quot;Add Variant&quot; to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Tabs
                value={currentVariantId || formData.variants[0].id}
                onValueChange={setCurrentVariantId}
              >
                <TabsList className="w-full justify-start bg-slate-100 p-1">
                  {formData.variants.map((variant) => (
                    <TabsTrigger
                      key={variant.id}
                      value={variant.id}
                      className="relative"
                    >
                      {variant.name || `Variant ${formData.variants.indexOf(variant) + 1}`}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {formData.variants.map((variant) => (
                  <TabsContent
                    key={variant.id}
                    value={variant.id}
                    className="space-y-4"
                  >
                    <VariantSection
                      variant={variant}
                      attributeOptions={attributeOptions[formData.category] || []}
                      onUpdate={(updates) => handleUpdateVariant(variant.id, updates)}
                      onRemove={() => handleRemoveVariant(variant.id)}
                    />

                    <div className="mt-6 border-t border-slate-200 pt-6">
                      <PricingSection
                        variant={variant}
                        onUpdate={(updates) => handleUpdateVariant(variant.id, updates)}
                      />
                    </div>

                    <div className="mt-6 border-t border-slate-200 pt-6">
                      <ImageUploadSection
                        variantId={variant.id}
                        images={variant.images}
                        onImagesUpdate={(images) => handleImagesUpdate(variant.id, images)}
                      />
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="lg"
          className="bg-blue-600 hover:bg-blue-700"
        >
          Submit & Log to Console
        </Button>
      </div>
    </form>
  )
}
