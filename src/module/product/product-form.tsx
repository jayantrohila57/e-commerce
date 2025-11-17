'use client'

import { type Route } from 'next'
import type { z } from 'zod/v3'
import { useRouter } from 'next/navigation'
import Form from '@/shared/components/form/form'
import { FormSection } from '@/shared/components/form/form.helper'
import { toast } from 'sonner'
import { Button } from '@/shared/components/ui/button'
import { Separator } from '@/shared/components/ui/separator'
import { apiClient } from '@/core/api/api.client'
import { STATUS } from '@/shared/config/api.config'
import { productContract } from './product.schema'
import { PATH } from '@/shared/config/routes'
import { env } from '@/shared/config/env'
import { useState } from 'react'
import { CategorySelect } from './product-form.category'
import { SubCategorySelect } from './product-form.subcategory'
import { SeriesSelect } from './product-form.series'
import { statusOptions } from '@/shared/config/options.config'
import { FormItem } from '@/shared/components/ui/form'
import { Minus, Plus } from 'lucide-react'

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
    const id = toast.loading('Creating product...')
    setToastId(id)
    createProduct.mutate({
      body: {
        title: data.body.title,
        slug: data.body.slug,
        description: data.body.description || undefined,
        metaTitle: data.body.title || undefined,
        metaDescription: data.body.description || undefined,
        seriesSlug: data.body.seriesSlug,
        isActive: data.body.isActive ?? true,
        basePrice: data.body.basePrice,
        baseCurrency: data.body.baseCurrency,
        features: data.body.features,
        categorySlug: data.body.categorySlug,
        subcategorySlug: data.body.subcategorySlug,
        status: data.body.status,
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
          categorySlug: '',
          subcategorySlug: '',
          isActive: true,
          basePrice: 0,
          baseCurrency: 'INR',
          features: [
            {
              title: '',
            },
          ],
          status: 'draft',
        },
      }}
      schema={formSchema}
      onSubmitAction={onSubmit}
      className="grid h-full grid-cols-4 gap-1 pb-20"
    >
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
        </FormSection>

        <Separator className="my-4" />

        <FormSection
          title="Product Category, Subcategory and Series"
          description="Select the category, subcategory and series of the product"
        >
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <CategorySelect />
            <SubCategorySelect />
            <SeriesSelect />
          </div>
        </FormSection>

        <Separator className="my-4" />
        <FormSection
          title="Product Price"
          description="Enter product price"
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <Form.Field
              {...{
                name: 'body.basePrice',
                label: 'Base Price',
                type: 'currency',
                prefixCurrency: '₹',
                postfixCurrency: 'INR',
                placeholder: 'Enter base price',
                required: true,
              }}
            />
          </div>
        </FormSection>
        <Separator className="my-4" />

        <FormSection
          title="Status"
          description="Control product visibility"
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <Form.Field
              {...{
                name: 'body.status',
                label: 'Status',
                type: 'select',
                description: 'Select the status of the post',
                helperText: 'The status is used to generate status of the post',
                required: true,
                placeholder: 'Select type',
                options: [
                  { label: 'Select type...', value: 'select-type', disabled: true },
                  ...statusOptions.map((t) => ({
                    label: t.label,
                    value: t.value,
                    icon: t.icon,
                  })),
                ],
              }}
            />
            <Form.Field
              {...{
                name: 'body.isActive',
                label: 'Active',
                type: 'switch',
                description: 'Set product visibility',
                helperText: 'Inactive products will not be visible to customers',
              }}
            />
          </div>
        </FormSection>
        <Separator className="my-4" />
        <FormSection
          title="Product Features"
          description="Enter product features"
          className="space-y-4"
        >
          <Form.FormGroup name="body.features">
            {({ index, add, remove, length }) => (
              <FormItem
                key={index}
                className="flex flex-row items-center justify-center gap-4"
              >
                <div className="w-full">
                  <Form.Field
                    key={`body.features.${index}.title`}
                    {...{
                      name: `body.features.${index}.title`,
                      label: 'Title',
                      type: 'text',
                      placeholder: 'Enter feature title',
                    }}
                  />
                </div>
                <div className="flex gap-2 pt-5">
                  <Button
                    key={`body.features.${index}.remove`}
                    disabled={index === length - 1}
                    hidden={index === length - 1}
                    type="button"
                    variant={'destructive'}
                    size={'icon'}
                    onClick={() => remove(index)}
                    children={<Minus />}
                  />
                  <Button
                    key={`body.features.${index}.add`}
                    type="button"
                    disabled={index !== length - 1}
                    hidden={index !== length - 1}
                    size={'icon'}
                    onClick={() =>
                      add({
                        title: '',
                      })
                    }
                    children={<Plus />}
                  />
                </div>
              </FormItem>
            )}
          </Form.FormGroup>
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
