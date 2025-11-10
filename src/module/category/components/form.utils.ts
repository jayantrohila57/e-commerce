import { FormInputProps } from "@/shared/components/form/form.types"

export const metaTitleField = (): FormInputProps => {
  return {
    name: 'metaTitle',
    label: 'Meta Title',
    type: 'text',
    description: 'Optional SEO title',
    placeholder: 'Enter meta title',
  }
}

export const metaDescriptionField = (): FormInputProps => {
  return {
    name: 'metaDescription',
    label: 'Meta Description',
    type: 'textarea',
    description: 'Optional SEO description',
    placeholder: 'Enter meta description',
  }
}