'use client'

import { apiClient } from '@/core/api/api.client'
import Form from '@/shared/components/form/form'
import { FormSection } from '@/shared/components/form/form.helper'
import { Button } from '@/shared/components/ui/button'
import { FormItem } from '@/shared/components/ui/form'
import { Separator } from '@/shared/components/ui/separator'
import { STATUS } from '@/shared/config/api.config'
import { env } from '@/shared/config/env'
import { PATH } from '@/shared/config/routes'
import { Minus, Plus } from 'lucide-react'
import { Route } from 'next'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import type { z } from 'zod/v3'
import { productVariantContract } from './product-variant.schema'

const formSchema = productVariantContract.create.input
type FormValues = z.infer<typeof formSchema>

interface VariantFormProps {
  productSlug: string
  productId: string
}

export default function VariantForm({ productSlug, productId }: VariantFormProps) {
  const router = useRouter()
  const [toastId, setToastId] = useState<string | number>('')
  const [isLoading, setIsLoading] = useState(false)

  const createVariant = apiClient.productVariant.create.useMutation({
    onSuccess: async ({ status, message }) => {
      if (status === STATUS.SUCCESS) {
        toast.success(message, { id: toastId })
        setToastId('')
        router.push(PATH.STUDIO.PRODUCTS.VIEW(productSlug) as Route)
      } else {
        toast.error(message, { id: toastId })
        setToastId('')
      }
      setIsLoading(false)
    },

    onError: ({ message }) => {
      toast.error(message || 'Error while creating variant', { id: toastId })
      setToastId('')
      setIsLoading(false)
    },
  })

  function onSubmit(data: FormValues) {
    const id = toast.loading('Creating variant with inventory...')
    setToastId(id)
    setIsLoading(true)

    createVariant.mutate({
      body: {
        productId,
        slug: data.body.slug,
        title: data.body.title,
        priceModifierType: data.body.priceModifierType,
        priceModifierValue: data.body.priceModifierValue,
        attributes: data.body.attributes,
        media: data.body.media,
        inventory: {
          sku: data.body.inventory.sku,
          barcode: data.body.inventory.barcode,
          quantity: data.body.inventory.quantity,
          incoming: data.body.inventory.incoming,
          reserved: data.body.inventory.reserved,
        },
      },
    })
  }

  return (
    <Form
      defaultValues={{
        body: {
          productId,
          slug: '',
          title: '',
          priceModifierType: 'flat_increase',
          priceModifierValue: '0',
          attributes: [
            {
              title: '',
              type: '',
              value: '',
            },
          ],
          media: [
            {
              url: '',
            },
          ],
          inventory: {
            sku: '',
            barcode: '',
            quantity: 0,
            incoming: 0,
            reserved: 0,
          },
        },
      }}
      schema={formSchema}
      onSubmitAction={onSubmit}
      className="grid h-full grid-cols-4 gap-4 p-4"
    >
      <div className="col-span-4 space-y-6">
        <FormSection
          title="Basic Info"
          description="Define your variant identity"
        >
          <Form.Field
            {...{
              name: 'body.title',
              label: 'Variant Title',
              type: 'text',
              placeholder: 'e.g. 128GB / Black',
              required: true,
            }}
          />

          <Form.Field
            {...{
              name: 'body.slug',
              label: 'Slug',
              type: 'slug',
              slugField: 'body.title',
              inlinePrefix: `${env.NEXT_PUBLIC_BASE_URL}/product/${productSlug}/`,
              required: true,
              placeholder: 'variant-name',
              description: 'URL-friendly identifier for the variant',
            }}
          />
        </FormSection>

        <Separator className="my-4" />

        <FormSection
          title="Pricing Logic"
          description="Control how this variant modifies base price"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Form.Field
              {...{
                name: 'body.priceModifierType',
                label: 'Price Modifier Type',
                type: 'select',
                required: true,
                options: [
                  { label: 'Flat Increase', value: 'flat_increase' },
                  { label: 'Flat Decrease', value: 'flat_decrease' },
                  { label: 'Percent Increase', value: 'percent_increase' },
                  { label: 'Percent Decrease', value: 'percent_decrease' },
                ],
              }}
            />

            <Form.Field
              {...{
                name: 'body.priceModifierValue',
                label: 'Modifier Value',
                type: 'number',
                required: true,
                description: 'Value depends on modifier type (amount or %)',
                placeholder: '0',
              }}
            />
          </div>
        </FormSection>
        <Separator className="my-4" />

        <FormSection
          title="Media"
          description="Add images specific to this variant"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Form.FormGroup name="body.media">
              {({ index, add, remove, length }) => (
                <FormItem
                  key={index}
                  className="flex flex-row items-center justify-center gap-4"
                >
                  <div className="h-full min-h-80 w-full">
                    <Form.Field
                      {...{
                        name: `body.media.${index}.url`,
                        label: 'Variant Media',
                        type: 'image',
                        description: 'Upload product images for this variant',
                      }}
                    />
                  </div>

                  <div className="flex items-start justify-start gap-2 pt-5">
                    <Button
                      key={`body.media.${index}.remove`}
                      disabled={index === length - 1}
                      hidden={index === length - 1}
                      type="button"
                      variant={'destructive'}
                      size={'icon'}
                      onClick={() => remove(index)}
                    >
                      <Minus />
                    </Button>
                    <Button
                      key={`body.media.${index}.add`}
                      type="button"
                      disabled={index !== length - 1}
                      hidden={index !== length - 1}
                      size={'icon'}
                      onClick={() =>
                        add({
                          title: '',
                        })
                      }
                    >
                      <Plus />
                    </Button>
                  </div>
                </FormItem>
              )}
            </Form.FormGroup>
          </div>
        </FormSection>
        <Separator className="my-4" />

        <FormSection
          title="Attributes"
          description="Define options such as size, color, material, etc."
        >
          <Form.FormGroup name="body.attributes">
            {({ index, add, remove, length }) => (
              <FormItem
                key={index}
                className="bg-input/30 flex flex-row items-center justify-center gap-4 rounded-md border p-2"
              >
                <div className="grid w-full grid-cols-1 items-center justify-start gap-4 p-4 md:grid-cols-2">
                  <Form.Field
                    {...{
                      name: `body.attributes.${index}.title`,
                      label: 'Title',
                      type: 'text',
                      placeholder: 'Feature title',
                    }}
                  />
                  <Form.Field
                    {...{
                      name: `body.attributes.${index}.type`,
                      label: 'Type',
                      type: 'select',
                      options: [
                        { label: 'Text', value: 'text' },
                        { label: 'Number', value: 'number' },
                        { label: 'Select', value: 'select' },
                        { label: 'Radio', value: 'radio' },
                        { label: 'Checkbox', value: 'checkbox' },
                      ],
                      placeholder: 'Feature type',
                    }}
                  />
                  <Form.Field
                    {...{
                      name: `body.attributes.${index}.value`,
                      label: 'Value',
                      type: 'text',
                      placeholder: 'Feature value',
                    }}
                  />
                </div>

                <div className="flex gap-2 pt-5">
                  <Button
                    key={`body.attributes.${index}.remove`}
                    disabled={index === length - 1}
                    hidden={index === length - 1}
                    type="button"
                    variant={'destructive'}
                    size={'icon'}
                    onClick={() => remove(index)}
                  >
                    <Minus />
                  </Button>
                  <Button
                    key={`body.attributes.${index}.add`}
                    type="button"
                    disabled={index !== length - 1}
                    hidden={index !== length - 1}
                    size={'icon'}
                    onClick={() =>
                      add({
                        title: '',
                      })
                    }
                  >
                    <Plus />
                  </Button>
                </div>
              </FormItem>
            )}
          </Form.FormGroup>
        </FormSection>
        <Separator className="my-4" />

        <FormSection
          title="Inventory"
          description="Manage stock levels, SKU, and barcode"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Form.Field
              {...{
                name: 'body.inventory.sku',
                label: 'SKU',
                type: 'text',
                required: true,
                placeholder: 'e.g. SKU-001-BLK-128GB',
                description: 'Unique stock keeping unit identifier',
              }}
            />

            <Form.Field
              {...{
                name: 'body.inventory.barcode',
                label: 'Barcode',
                type: 'text',
                placeholder: 'e.g. 123456789012',
                description: 'Optional barcode for scanning',
              }}
            />

            <Form.Field
              {...{
                name: 'body.inventory.quantity',
                label: 'Available Quantity',
                type: 'number',
                required: true,
                placeholder: '0',
                description: 'Current stock available for sale',
              }}
            />

            <Form.Field
              {...{
                name: 'body.inventory.incoming',
                label: 'Incoming Quantity',
                type: 'number',
                required: true,
                placeholder: '0',
                description: 'Stock on order/in transit',
              }}
            />

            <Form.Field
              {...{
                name: 'body.inventory.reserved',
                label: 'Reserved Quantity',
                type: 'number',
                required: true,
                placeholder: '0',
                description: 'Stock reserved for orders',
              }}
            />
          </div>
        </FormSection>
      </div>

      <div className="col-span-4 flex h-full min-h-20 w-full flex-col justify-between gap-4 border-t pt-4 sm:flex-row sm:items-center">
        <div className="text-muted-foreground text-sm">
          <Form.StatusBadge />
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
            label="Create Variant"
            disabled={isLoading}
            isLoading={isLoading}
          />
        </div>
      </div>
    </Form>
  )
}
