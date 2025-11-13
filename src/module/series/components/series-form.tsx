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
import type { z } from 'zod/v3'
import { env } from '@/shared/config/env'
import { colorOptions, displayTypeOptions, visibilityOptions } from '@/shared/config/options.config'
import { useState } from 'react'
import { seriesContract } from '../dto/dto.series.contract'
import { Route } from 'next'

const formSchema = seriesContract.create.input

type FormValues = z.infer<typeof formSchema>

interface SeriesFormProps {
  subcategorySlug: string
  categorySlug: string
  subcategoryId: string
}

export default function SeriesForm({ subcategorySlug, categorySlug, subcategoryId }: SeriesFormProps) {
  const router = useRouter()
  const [toastId, setToastId] = useState<string | number>('')
  const [isLoading, setIsLoading] = useState(false)

  const createSeries = apiClient.series.create.useMutation({
    onSuccess: async ({ status, message }) => {
      if (status === STATUS.SUCCESS) {
        toast.success(message, { id: toastId })
        setToastId('')
        router.push(PATH.STUDIO.SERIES.ROOT(categorySlug, subcategorySlug, subcategoryId) as Route)
      } else if (status === STATUS.FAILED || status === STATUS.ERROR) {
        toast.error(message, { id: toastId })
        setToastId('')
      }
      setIsLoading(false)
    },
    onError: ({ message }) => {
      toast.error(message || 'An error occurred while creating the series', { id: toastId })
      setToastId('')
      setIsLoading(false)
    },
  })

  function onSubmit(data: FormValues) {
    setToastId('')
    const id = toast.loading('Creating series')
    setToastId(id)
    setIsLoading(true)

    createSeries.mutate({
      body: {
        subcategorySlug,
        slug: data.body.slug,
        title: data.body.title,
        description: data.body.description,
        color: data.body.color,
        image: data.body.image,
        displayType: data.body.displayType,
        visibility: data.body.visibility,
        displayOrder: data.body.displayOrder || 0,
        isFeatured: data.body.isFeatured ?? false,
        metaTitle: data.body.metaTitle || data.body.title,
        metaDescription: data.body.metaDescription || data.body.description,
        icon: data.body.icon || 'folder',
      },
    })
  }

  return (
    <Form
      defaultValues={{
        body: {
          subcategorySlug,
          slug: '',
          title: '',
          description: '',
          color: '#3b82f6',
          image: '',
          displayType: 'grid',
          visibility: 'public',
          displayOrder: 0,
          isFeatured: false,
          metaTitle: '',
          metaDescription: '',
          icon: 'folder',
        },
      }}
      schema={formSchema}
      onSubmitAction={onSubmit}
      className="grid h-full grid-cols-4 gap-4 rounded-md border p-4"
    >
      <div className="col-span-4 h-full w-full space-y-6">
        <FormSection
          title="Basic Information"
          description="Enter series details"
        >
          <Form.Field
            {...{
              name: 'body.title',
              label: 'Title',
              type: 'text',
              placeholder: 'Enter series title',
              required: true,
            }}
          />
          <Form.Field
            {...{
              name: 'body.slug',
              label: 'Slug',
              type: 'slug',
              slugField: 'body.title',
              description: 'URL-friendly version of the title',
              helperText: 'The slug is used in the URL',
              inlinePrefix: `${env.NEXT_PUBLIC_BASE_URL}/category/${categorySlug}/${subcategorySlug}/`,
              required: true,
              placeholder: 'series-name',
            }}
          />
          <Form.Field
            {...{
              name: 'body.description',
              label: 'Description',
              type: 'textarea',
              placeholder: 'Enter a brief description of the series',
              rows: 3,
            }}
          />
        </FormSection>
        <Separator className="my-4" />

        <FormSection
          title="Media"
          description="Upload images and icons for this series"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Form.Field
              {...{
                name: 'body.image',
                label: 'Featured Image',
                type: 'image',
                description: 'Main image for the series',
                helperText: 'Recommended size: 1200x630px',
                required: false,
                placeholder: 'Upload image',
              }}
            />
          </div>
        </FormSection>

        <Separator className="my-4" />

        <FormSection
          title="Display Settings"
          description="Configure how this series appears to users"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <Form.Field
                {...{
                  name: 'body.displayType',
                  label: 'Display Type',
                  type: 'select',
                  description: 'How products in this series should be displayed',
                  helperText: 'Grid is recommended for most cases',
                  required: true,
                  options: displayTypeOptions.map((t) => ({
                    label: t.label,
                    value: t.value,
                    icon: t.icon,
                  })),
                }}
              />

              <Form.Field
                {...{
                  name: 'body.visibility',
                  label: 'Visibility',
                  type: 'select',
                  description: 'Control who can see this series',
                  helperText: 'Hidden items are only visible to admins',
                  required: true,
                  options: visibilityOptions.map((t) => ({
                    label: t.label,
                    value: t.value,
                    icon: t.icon,
                  })),
                }}
              />
            </div>

            <div className="space-y-4">
              <Form.Field
                {...{
                  name: 'body.color',
                  label: 'Accent Color',
                  type: 'color',
                  description: 'Used for highlights and accents',
                  helperText: 'Pick a color that represents this series',
                  required: false,
                  options: colorOptions.map((c) => ({
                    label: c.label,
                    value: c.value,
                    color: c.color,
                  })),
                }}
              />

              <Form.Field
                {...{
                  name: 'body.isFeatured',
                  label: 'Featured Series',
                  type: 'switch',
                  description: 'Show this series in featured sections',
                  helperText: 'Featured items may appear in special sections of your store',
                }}
              />
            </div>
          </div>
        </FormSection>
        <Separator className="my-4" />
        <FormSection
          title="SEO & Metadata"
          description="Optimize for search engines and social sharing"
        >
          <Form.Field
            {...{
              name: 'body.metaTitle',
              label: 'Meta Title',
              type: 'text',
              description: 'Title for search engines (leave blank to use series title)',
              placeholder: 'Enter meta title',
              maxLength: 60,
            }}
          />
          <Form.Field
            {...{
              name: 'body.metaDescription',
              label: 'Meta Description',
              type: 'textarea',
              description: 'Description for search engines (leave blank to use series description)',
              placeholder: 'Enter meta description',
            }}
          />
        </FormSection>
      </div>

      <Separator className="col-span-4 mt-4" />

      <div className="col-span-4 flex h-auto w-full flex-col justify-between gap-4 border-t pt-4 sm:flex-row sm:items-center">
        <div className="text-muted-foreground text-sm">
          <Form.StatusBadge />
          <p className="mt-1 text-xs">Changes are saved automatically when you submit the form.</p>
        </div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Form.Submit
            label="Create Series"
            disabled={isLoading}
            isLoading={isLoading}
          />
        </div>
      </div>
    </Form>
  )
}
