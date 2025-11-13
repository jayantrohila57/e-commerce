'use client'

import { useRouter } from 'next/navigation'
import Form from '@/shared/components/form/form'
import { FormSection } from '@/shared/components/form/form.helper'
import { toast } from 'sonner'
import { Button } from '@/shared/components/ui/button'
import { Separator } from '@/shared/components/ui/separator'
import { apiClient } from '@/core/api/api.client'
import { STATUS } from '@/shared/config/api.config'
import { productContract } from '../dto/dto.product.contract'
import { PATH } from '@/shared/config/routes'
import { type Route } from 'next'
import type { z } from 'zod/v3'
import { env } from '@/shared/config/env'
import { useState } from 'react'

const formSchema = productContract.create.input

type FormValues = z.infer<typeof formSchema>

export default function ProductForm() {
  const router = useRouter()
  const [toastId, setToastId] = useState<string | number>('')

  const createProduct = apiClient.product.create.useMutation({
    onSuccess: async ({ status, message }) => {
      if (status === STATUS.SUCCESS) {
        toast.success(message, { id: toastId })
        setToastId('')
        router.push(PATH.STUDIO.PRODUCTS.ROOT as Route)
      } else if (status === STATUS.FAILED || status === STATUS.ERROR) {
        toast.error(message, { id: toastId })
        setToastId('')
      }
    },
    onError: ({ message }) => {
      toast.error(message || 'An error occurred while creating the product', { id: toastId })
      setToastId('')
    },
  })

  function onSubmit(data: FormValues) {
    setToastId('')
    const id = toast.loading('Creating product')
    setToastId(id)
    createProduct.mutate({
      body: {
        title: data.body.title,
        slug: data.body.slug,
        description: data.body.description || undefined,
        metaTitle: data.body.metaTitle || undefined,
        metaDescription: data.body.metaDescription || undefined,
        seriesSlug: data.body.seriesSlug,
        baseImage: data.body.baseImage || undefined,
        isActive: data.body.isActive ?? true,
      },
    })
  }

  return (
    <Form
      defaultValues={{
        body: {
          title: '',
          slug: '',
          description: '',
          metaTitle: '',
          metaDescription: '',
          seriesSlug: '',
          baseImage: '',
          isActive: true,
        },
      }}
      schema={formSchema}
      onSubmitAction={onSubmit}
      className="grid h-full grid-cols-4 gap-1 pb-20"
    >
      {' '}
      <div className="col-span-4 h-full w-full">
        <FormSection
          title="Product Details"
          description="Enter product information"
        >
          <Form.Field
            {...{
              name: 'body.title',
              label: 'Title',
              type: 'text',
              placeholder: 'Enter product title',
              required: true,
            }}
          />
          <Form.Field
            {...{
              name: 'body.slug',
              label: 'Slug',
              type: 'slug',
              slugField: 'body.title',
              description: 'Enter the slug of the product',
              helperText: 'The slug is used to generate the URL of the product',
              inlinePrefix: `${env.NEXT_PUBLIC_BASE_URL}/product/`,
              required: true,
              placeholder: 'Enter slug',
            }}
          />
          <Form.Field
            {...{
              name: 'body.description',
              label: 'Description',
              type: 'textarea',
              placeholder: 'Enter product description',
            }}
          />
          <Form.Field
            {...{
              name: 'body.seriesSlug',
              label: 'Series',
              type: 'text',
              placeholder: 'Enter series slug',
              required: true,
              description: 'The series this product belongs to',
            }}
          />
        </FormSection>

        <Separator className="my-4" />

        <FormSection
          title="Product Image"
          description="Upload the main image of the product"
        >
          <Form.Field
            {...{
              name: 'body.baseImage',
              label: 'Product Image',
              type: 'image',
              description: 'Upload the main image of the product',
              helperText: 'After selecting, click the upload icon to attach the image',
              required: false,
              placeholder: 'Upload product image',
            }}
          />
        </FormSection>

        <Separator className="my-4" />

        <FormSection
          title="SEO"
          description="Search engine optimization settings"
        >
          <Form.Field
            {...{
              name: 'body.metaTitle',
              label: 'Meta Title',
              type: 'text',
              placeholder: 'Enter meta title',
              description: 'Title used for SEO and social sharing',
            }}
          />
          <Form.Field
            {...{
              name: 'body.metaDescription',
              label: 'Meta Description',
              type: 'textarea',
              placeholder: 'Enter meta description',
              description: 'Description used for SEO and social sharing',
            }}
          />
        </FormSection>

        <FormSection
          title="Status"
          description="Control product visibility"
          className="space-y-4"
        >
          <Form.Field
            {...{
              name: 'body.isActive',
              label: 'Active',
              type: 'switch',
              description: 'Set product visibility',
              helperText: 'Inactive products will not be visible to customers',
            }}
          />
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
            disabled={createProduct.isPending}
            isLoading={createProduct.isPending}
          />
        </div>
      </div>
    </Form>
  )
}
