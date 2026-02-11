'use client'

import { useRouter } from 'next/navigation'
import Form from '@/shared/components/form/form'
import { FormSection } from '@/shared/components/form/form.helper'
import { toast } from 'sonner'
import { Button } from '@/shared/components/ui/button'
import { Separator } from '@/shared/components/ui/separator'
import { apiClient } from '@/core/api/api.client'
import { STATUS } from '@/shared/config/api.config'
import { PATH } from '@/shared/config/routes'
import { type Route } from 'next'
import type { z } from 'zod/v3'
import { clientEnv } from '@/shared/config/env.client'
import { colorOptions, displayTypeOptions, visibilityOptions } from '@/shared/config/options.config'
import { useState } from 'react'
import type { CategoryUpdate } from './category.types'
import { categoryContract } from './category.schema'

const formSchema = categoryContract.update.input
type FormValues = z.infer<typeof formSchema>

export default function CategoryEditForm({ category }: { category: CategoryUpdate | null }) {
  const router = useRouter()
  const [toastId, setToastId] = useState<string | number>('')

  const updateCategory = apiClient.category.update.useMutation({
    onSuccess: async ({ status, message }) => {
      if (status === STATUS.SUCCESS) {
        toast.success(message, { id: toastId })
        setToastId('')
        router.push(PATH.STUDIO.CATEGORIES.ROOT as Route)
      } else if (status === STATUS.FAILED || status === STATUS.ERROR) {
        toast.error(message, { id: toastId })
        setToastId('')
      }
    },
    onError: ({ message }) => {
      toast.error(message || 'An error occurred while creating the category', { id: toastId })
      setToastId('')
    },
  })

  function onSubmit(data: FormValues) {
    if (!category) {
      toast.error('Category not found')
      return
    }

    setToastId('')
    const id = toast.loading('Updating category')
    setToastId(id)

    updateCategory.mutate({
      params: {
        id: String(category?.id),
      },
      body: {
        slug: data.body.slug,
        title: data.body.title,
        description: data.body.description,
        color: data.body.color,
        image: data.body.image,
        displayType: data.body.displayType,
        visibility: data.body.visibility,
        displayOrder: data.body.displayOrder,
        isFeatured: data.body.isFeatured ?? false,
        metaTitle: data.body.title,
        metaDescription: data.body.description,
        icon: data.body.icon,
      },
    })
  }

  return (
    <Form
      defaultValues={{
        params: {
          id: String(category?.id),
        },
        body: {
          ...category,
        },
      }}
      schema={formSchema}
      onSubmitAction={onSubmit}
      className="grid h-full grid-cols-4 gap-1 pb-20"
    >
      <div className="col-span-4 h-full w-full">
        <FormSection
          title="Category Details"
          description="Enter category information"
        >
          <Form.Field
            {...{
              name: 'body.title',
              label: 'Title',
              type: 'text',
              placeholder: 'Enter category title',
              required: true,
            }}
          />
          <Form.Field
            {...{
              name: 'body.slug',
              label: 'Slug',
              type: 'slug',
              slugField: 'body.title',
              description: 'Enter the slug of the post',
              helperText: 'The slug is used to generate the URL of the post',
              inlinePrefix: `${clientEnv.NEXT_PUBLIC_BASE_URL}/category/`,
              required: true,
              placeholder: 'Enter slug',
            }}
          />
          <Form.Field
            {...{
              name: 'body.description',
              label: 'Description',
              type: 'textarea',
              placeholder: 'Enter category description',
            }}
          />
        </FormSection>
        <Separator className="my-4" />

        <FormSection
          title="Image"
          description="Upload the image of the category"
        >
          <Form.Field
            {...{
              name: 'body.image',
              label: 'Image',
              type: 'image',
              description: 'Upload the image of the category',
              helperText:
                'After selecting, click the upload icon to attach the imageThe image is used to generate the meta image of the category',
              required: true,
              placeholder: 'Upload image',
            }}
          />
        </FormSection>

        <Separator className="my-4" />

        <FormSection
          title="Display Settings"
          description="Control how this category is shown to users"
        >
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <Form.Field
              {...{
                name: 'body.displayType',
                label: 'Display Type',
                type: 'select',
                description: 'Select the display type of the post',
                helperText: 'The display type is used to display the category',
                required: true,
                placeholder: 'Select display type',
                options: [
                  { label: 'Select type...', value: 'select-type', disabled: true },
                  ...displayTypeOptions.map((t) => ({
                    label: t.label,
                    value: t.value,
                    icon: t.icon,
                  })),
                ],
              }}
            />
            <Form.Field
              {...{
                name: 'body.visibility',
                label: 'Visibility',
                type: 'select',
                description: 'Select the visibility of the post',
                helperText: 'The visibility is used to generate visibility of the post',
                required: true,
                placeholder: 'Select type',
                options: [
                  { label: 'Select type...', value: 'select-type', disabled: true },
                  ...visibilityOptions.map((t) => ({
                    label: t.label,
                    value: t.value,
                    icon: t.icon,
                  })),
                ],
              }}
            />
            <Form.Field
              {...{
                name: 'body.isFeatured',
                label: 'Is Featured',
                type: 'switch',
                description: 'Mark this post as featured',
                helperText: 'The isFeatured is used to generate   isFeatured of the post',
                required: true,
                placeholder: 'Select isFeatured',
              }}
            />
            <Form.Field
              {...{
                name: 'body.color',
                label: 'Color',
                type: 'color',
                description: 'Enter the color of the post',
                helperText: 'The color is used to generate   color of the post',
                required: true,
                placeholder: 'Enter color',
                options: [
                  ...colorOptions.map((c) => ({
                    label: c.label,
                    value: c.value,
                    icon: c.icon,
                    color: c.color,
                  })),
                ],
              }}
            />
          </div>
        </FormSection>
      </div>

      <Separator className="col-span-4 mt-4" />

      <div className="col-span-4 flex h-auto w-full flex-row items-center justify-between gap-x-4 p-0 py-4">
        <Form.StatusBadge />
        <div className="flex flex-row items-center gap-2">
          <Button
            variant="outline"
            type="button"
          >
            {'Save Draft'}
          </Button>
          <Form.Submit
            disabled={updateCategory.isPending}
            isLoading={updateCategory.isPending}
          />
        </div>
      </div>
    </Form>
  )
}
