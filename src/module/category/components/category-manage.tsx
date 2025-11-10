'use client'

import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import CategoryForm from './category-form'
import SubcategoryForm from './subcategory-form'
import { debugLog } from '@/shared/utils/lib/logger.utils'

export default function CategoryManage() {
  const [categories, setCategories] = useState([])

  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editingSubcategory, setEditingSubcategory] = useState<{ catId: string; subId: string } | null>(null)

  const handleAddCategory = (categoryData: { name: string; description: string }) => {
    const newCategory = {
      id: categoryData.name.toLowerCase().replace(/\s+/g, '-'),
      name: categoryData.name,
      description: categoryData.description,
      subcategories: [],
    }
    setCategories([...categories, newCategory])
  }

  const handleUpdateCategory = (categoryId: string, updates: { name: string; description: string }) => {
    setCategories(categories.map((cat) => (cat.id === categoryId ? { ...cat, ...updates } : cat)))
    setEditingCategory(null)
  }

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter((cat) => cat.id !== categoryId))
  }

  const handleAddSubcategory = (categoryId: string, subcategoryData: { name: string; attributes: string[] }) => {
    setCategories(
      categories.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            subcategories: [
              ...cat.subcategories,
              {
                id: subcategoryData.name.toLowerCase().replace(/\s+/g, '-'),
                name: subcategoryData.name,
                attributes: subcategoryData.attributes,
              },
            ],
          }
        }
        return cat
      }),
    )
  }

  const handleUpdateSubcategory = (
    categoryId: string,
    subcategoryId: string,
    updates: { name: string; attributes: string[] },
  ) => {
    setCategories(
      categories.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            subcategories: cat.subcategories.map((sub) => (sub.id === subcategoryId ? { ...sub, ...updates } : sub)),
          }
        }
        return cat
      }),
    )
    setEditingSubcategory(null)
  }

  const handleDeleteSubcategory = (categoryId: string, subcategoryId: string) => {
    setCategories(
      categories.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            subcategories: cat.subcategories.filter((sub) => sub.id !== subcategoryId),
          }
        }
        return cat
      }),
    )
  }

  const handleExportConfig = () => {
    const config = {
      timestamp: new Date().toISOString(),
      categories: categories,
    }
    debugLog('Category Configuration:')
    debugLog('log', JSON.stringify(config, null, 2))
    alert('Category configuration exported to console!')
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex-1">
                <CardTitle>{category.name}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setEditingCategory(category.id)}
                  variant="outline"
                  size="sm"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => handleDeleteCategory(category.id)}
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {editingCategory === category.id ? (
                <CategoryForm
                  initialData={{ name: category.name, description: category.description }}
                  onSubmit={(data) => handleUpdateCategory(category.id, data)}
                  onCancel={() => setEditingCategory(null)}
                />
              ) : (
                <div className="space-y-4">
                  <div>
                    <h4 className="mb-3 text-sm font-semibold">Subcategories ({category.subcategories.length})</h4>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-1">
                      {category.subcategories.map((subcat) => (
                        <div
                          key={subcat.id}
                          className="bg-secondary flex items-start justify-between rounded border p-3"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium">{subcat.name}</p>
                            <p className="text-muted-foreground mt-1 text-xs">
                              Attributes: {subcat.attributes.join(', ')}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              onClick={() => setEditingSubcategory({ catId: category.id, subId: subcat.id })}
                              variant="ghost"
                              size="sm"
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteSubcategory(category.id, subcat.id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {editingSubcategory?.catId === category.id ? (
                      <div className="mt-4 border-t pt-4">
                        <SubcategoryForm
                          initialData={
                            category.subcategories.find((s) => s.id === editingSubcategory.subId) || {
                              name: '',
                              attributes: [],
                            }
                          }
                          onSubmit={(data) => handleUpdateSubcategory(category.id, editingSubcategory.subId, data)}
                          onCancel={() => setEditingSubcategory(null)}
                        />
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleAddSubcategory(category.id, { name: '', attributes: [] })}
                        variant="outline"
                        size="sm"
                        className="mt-4 gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add Subcategory
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="my-4">
        <Button
          onClick={() => setEditingCategory('new')}
          size="lg"
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New Category
        </Button>
        {/* {editingCategory === 'new' && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Add New Category</CardTitle>
            </CardHeader>
            <CardContent>
              <CategoryForm
                onSubmit={(data) => {
                  handleAddCategory(data)
                  setEditingCategory(null)
                }}
                onCancel={() => setEditingCategory(null)}
              />
            </CardContent>
          </Card>
        )} */}
      </div>
    </div>
  )
}
