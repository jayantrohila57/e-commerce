'use client'

import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Plus, X } from 'lucide-react'

export default function SeriesForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    attributes: initialData?.attributes || [],
  })
  const [newAttr, setNewAttr] = useState('')

  const addAttr = () => {
    if (!newAttr.trim()) return
    if (formData.attributes.includes(newAttr.trim())) return
    setFormData({ ...formData, attributes: [...formData.attributes, newAttr.trim()] })
    setNewAttr('')
  }

  const removeAttr = (a) => {
    setFormData({ ...formData, attributes: formData.attributes.filter((x) => x !== a) })
  }

  const submit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-4"
    >
      <div>
        <label className="text-sm font-medium">Series Name *</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. Smartphones"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">Attributes *</label>
        <div className="flex gap-2">
          <Input
            value={newAttr}
            onChange={(e) => setNewAttr(e.target.value)}
            placeholder="Color, RAM, etc."
          />
          <Button
            type="button"
            onClick={addAttr}
            variant="outline"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {formData.attributes.map((a) => (
            <span
              key={a}
              className="bg-primary text-primary-foreground flex items-center gap-2 rounded-full px-3 py-1 text-sm"
            >
              {a}
              <button
                type="button"
                onClick={() => removeAttr(a)}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
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
        <Button type="submit">Save Series</Button>
      </div>
    </form>
  )
}
