'use client'

import type React from 'react'

import { useState } from 'react'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { X, Upload } from 'lucide-react'

interface ImageUploadSectionProps {
  variantId: string
  images: string[]
  onImagesUpdate: (images: string[]) => void
}

export default function ImageUploadSection({ variantId, images, onImagesUpdate }: ImageUploadSectionProps) {
  const [imageUrl, setImageUrl] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const url = event.target?.result as string
        setPreviewUrl(url)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddImage = () => {
    if (previewUrl) {
      onImagesUpdate([...images, previewUrl])
      setPreviewUrl('')
      setImageUrl('')
    }
  }

  const handleRemoveImage = (index: number) => {
    onImagesUpdate(images.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-900">Images for this Variant</h3>

      {/* Image Upload Input */}
      <div className="rounded-lg border-2 border-dashed border-slate-300 p-6 transition-colors hover:border-blue-500">
        <div className="flex items-center justify-center gap-3">
          <Upload className="h-5 w-5 text-slate-400" />
          <div>
            <label className="cursor-pointer">
              <span className="text-sm font-medium text-blue-600 hover:underline">Click to upload</span>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </label>
            <p className="mt-1 text-xs text-slate-500">or drag and drop</p>
          </div>
        </div>
      </div>

      {/* Image Preview */}
      {previewUrl && (
        <div className="space-y-3">
          <div className="relative h-40 w-40 overflow-hidden rounded-lg bg-slate-100">
            <img
              src={previewUrl || '/placeholder.svg'}
              alt="Preview"
              className="h-full w-full object-cover"
            />
          </div>
          <Button
            type="button"
            onClick={handleAddImage}
            size="sm"
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Add Image
          </Button>
        </div>
      )}

      {/* Image Gallery */}
      {images.length > 0 && (
        <div>
          <p className="mb-3 text-xs text-slate-600">
            {images.length} image{images.length !== 1 ? 's' : ''} added
          </p>
          <div className="grid grid-cols-4 gap-3">
            {images.map((image, index) => (
              <div
                key={index}
                className="group relative h-24 w-24 overflow-hidden rounded-lg bg-slate-100"
              >
                <img
                  src={image || '/placeholder.svg'}
                  alt={`Product ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
