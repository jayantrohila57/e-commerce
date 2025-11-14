'use client'

import type React from 'react'

import { useState } from 'react'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { X, Plus } from 'lucide-react'

interface KeyPointsSectionProps {
  keyPoints: string[]
  onAdd: (point: string) => void
  onRemove: (index: number) => void
}

export default function KeyPointsSection({ keyPoints, onAdd, onRemove }: KeyPointsSectionProps) {
  const [inputValue, setInputValue] = useState('')

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue)
      setInputValue('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Add a key point (e.g., Waterproof, Long battery life)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={handleAdd}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>

      {keyPoints.length > 0 && (
        <div className="space-y-2">
          {keyPoints.map((point, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3"
            >
              <span className="text-sm text-slate-700">{point}</span>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="text-slate-400 transition-colors hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
