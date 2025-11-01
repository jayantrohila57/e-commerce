'use client'

import { useFormContext } from 'react-hook-form'
import { Input } from '@/shared/components/ui/input'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import type { FormInputProps } from '../form.types'
import { cn } from '@/shared/utils/lib/utils'
import { useId } from 'react'

export const InputText: React.FC<FormInputProps> = (props) => {
  const reactId = useId()
  const stableId = props.name ? `${props.name}-${reactId}` : reactId
  const { control } = useFormContext()

  if (props?.hidden) return null
  if (props.type !== 'text') return null

  return (
    <FormField
      control={control}
      name={props.name}
      render={({ field, fieldState }) => (
        <FormItem
          id={stableId}
          className={cn(props.className)}
        >
          <FormLabel required={props.required}>{props.label}</FormLabel>
          <FormControl>
            <Input
              id={stableId}
              {...field}
              {...props.fieldProps}
              placeholder={props.placeholder}
              type="text"
              className={cn(fieldState.error && 'border-destructive focus-visible:ring-destructive')}
            />
          </FormControl>
          {props.helperText && <FormDescription className={cn('')}>{props.helperText}</FormDescription>}
          <FormMessage>{fieldState.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  )
}
