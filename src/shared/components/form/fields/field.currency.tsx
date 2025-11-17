'use client'

import { Controller, useFormContext } from 'react-hook-form'
import { Input } from '@/shared/components/ui/input'
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { cn } from '@/shared/utils/lib/utils'
import type { FormInputProps } from '../form.types'
import { useEffect, useId, useState } from 'react'

export const InputCurrency: React.FC<FormInputProps> = (props) => {
  const reactId = useId()
  const stableId = props.name ? `${props.name}-${reactId}` : reactId
  const [display, setDisplay] = useState('')

  const { control, register, setValue, getValues, formState } = useFormContext()

  // Sync formatted display whenever form value changes
  useEffect(() => {
    const val = getValues(props.name)

    if (val === '' || val === null || val === undefined) {
      setDisplay('')
      return
    }

    const num = Number(val)
    setDisplay(num.toLocaleString('en-IN'))
  }, [getValues(props.name)]) // reacts to external changes (reset, defaultValues, watch)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, '')

    // Allow blank
    if (raw === '') {
      setValue(props.name, '')
      setDisplay('')
      return
    }

    const num = Number(raw)
    if (!Number.isNaN(num)) {
      setValue(props.name, num) // raw numeric user data
      setDisplay(num.toLocaleString('en-IN')) // pretty UI string
    }
  }
  if (props?.hidden) return null
  if (props.type !== 'currency') return null

  const inputConfig = {
    placeholder: props?.placeholder,
    type: 'number',
    max: props?.max,
    min: props?.min,
    readOnly: props?.readonly,
  }
  return (
    <Controller
      name={props?.name}
      control={control}
      render={({ field, fieldState }) => (
        <FormItem id={stableId}>
          <FormLabel required={props.required}>{props.label}</FormLabel>
          <FormControl className={cn(props?.className)}>
            <div className="*:not-first:mt-2">
              <div className="relative">
                <Input
                  className="peer ps-6 pe-12"
                  {...field}
                  {...props?.fieldProps}
                  {...inputConfig}
                  value={display}
                  onChange={handleChange}
                  type="text"
                />
                <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm peer-disabled:opacity-50">
                  {props?.prefixCurrency}
                </span>
                <span className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
                  {props?.postfixCurrency}
                </span>
              </div>
            </div>
          </FormControl>
          <FormDescription>{props?.helperText}</FormDescription>
          <FormMessage>{fieldState?.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  )
}
