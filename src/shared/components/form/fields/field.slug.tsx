'use client'

import { useFormContext } from 'react-hook-form'
import { Input } from '@/shared/components/ui/input'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import type { FormInputProps } from '../form.types'
import { cn } from '@/shared/utils/lib/utils'
import { useId, useEffect, useRef } from 'react'
import { LinkIcon } from 'lucide-react'
import { nameToSlug } from '@/shared/utils/lib/url.utils'

export const InputSlug: React.FC<FormInputProps> = (props) => {
  const reactId = useId()
  const stableId = props.name ? `${props.name}-${reactId}` : reactId
  const { control, watch, setValue } = useFormContext()

  const sourceValue = props.slugField ? watch(props.slugField) : ''
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!props.slugField) return
    if (!sourceValue) return

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      const slug = nameToSlug(String(sourceValue))
      setValue(props.name, slug, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      })
    }, 300) // debounce delay in ms

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [sourceValue, props.slugField, props.name, setValue])

  if (props?.hidden) return null
  if (props.type !== 'slug') return null

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
            <div className="relative flex w-full rounded-md">
              {props.inlinePrefix && (
                <span
                  className={cn(
                    'inline-flex items-center rounded-s-md border px-3',
                    'bg-secondary-foreground text-secondary/80 border-input',
                    'gap-2',
                  )}
                >
                  <LinkIcon className="text-primary size-4" />
                  <span className="flex flex-row text-sm">{props.inlinePrefix}</span>
                </span>
              )}
              <Input
                {...field}
                readOnly
                placeholder={props.placeholder}
                type="text"
                className={cn(
                  fieldState.error && 'border-destructive focus-visible:ring-destructive',
                  props.inlinePrefix && '-ms-px rounded-s-none shadow-none',
                )}
              />
            </div>
          </FormControl>
          {props.helperText && <FormDescription>{props.helperText}</FormDescription>}
          <FormMessage>{fieldState.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  )
}
