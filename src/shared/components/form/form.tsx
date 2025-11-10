'use client'

import { FormProvider, useForm, useFormContext, type FieldValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/shared/utils/lib/utils'
import type z from 'zod/v3'

import { Fragment, memo, useMemo } from 'react'
import { Fields } from './fields.config'
import type {
  FieldsWrapperProps,
  FormContextProps,
  FormInputProps,
  FormProps,
  FormWatchErrorProps,
  FormWatchProps,
  SubmitButtonProps,
} from './form.types'
import { Button } from '../ui/button'
import { Dot, Info, Loader } from 'lucide-react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import { Separator } from '../ui/separator'
import { Badge } from '../ui/badge'

export const Form = <T extends z.ZodTypeAny>(props: FormProps<T>) => {
  const { onSubmitAction, className, children, schema, defaultValues } = props

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    shouldFocusError: true,
    progressive: true,
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    void form.handleSubmit((values: z.infer<T>) => {
      onSubmitAction(values)
    })()
  }

  // const watch = form.watch()
  // useEffect(() => {
  //   debugLog('watch', watch)
  // }, [watch])

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit}
        className={cn('', className)}
      >
        {children}
      </form>
    </FormProvider>
  )
}

const FormContext = memo(<TFieldValues extends FieldValues>({ children }: FormContextProps<TFieldValues>) => {
  const context = useFormContext<TFieldValues>()
  return <>{children(context)}</>
})

FormContext.displayName = 'FormContext'

const Field = memo((props: FormInputProps) => {
  const Element = Fields[props?.type]
  if (!Element) return null
  return <Element {...props} />
})

Field.displayName = 'Field'

const FieldsWrapper = memo(({ fieldsConfig = [] }: FieldsWrapperProps) => {
  const fields = useMemo(() => {
    return fieldsConfig?.map((props: FormInputProps) => {
      return (
        <Field
          key={props?.name}
          {...props}
        />
      )
    })
  }, [fieldsConfig])

  return <Fragment>{fields}</Fragment>
})

FieldsWrapper.displayName = 'FieldsWrapper'

const FormWatch = memo(<TFieldValues extends FieldValues>({ value, children }: FormWatchProps<TFieldValues>) => {
  const { watch } = useFormContext<TFieldValues>()
  const watching = watch(value)
  return <>{children(watching)}</>
})

FormWatch.displayName = 'FormWatch'

const FormWatchError = memo(
  <TFieldValues extends FieldValues>({ name, children }: FormWatchErrorProps<TFieldValues>) => {
    const {
      formState: { errors },
    } = useFormContext<TFieldValues>()
    const error = errors[name]
    return <>{children(error)}</>
  },
)

FormWatchError.displayName = 'FormWatchError'

interface StatusBadgeProps<TFieldValues extends FieldValues> {
  label?: string
  className?: string
}

const StatusBadge = memo(<TFieldValues extends FieldValues>({ label, className }: StatusBadgeProps<TFieldValues>) => {
  const {
    formState: { isValid, errors },
  } = useFormContext<TFieldValues>()
  const errorEntries = useMemo(() => Object?.entries(errors), [errors])

  return (
    <div className="relative">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Badge
            variant="outline"
            className={cn(
              'relative flex h-8 cursor-pointer items-center gap-1 select-none',
              isValid ? 'text-green-600' : 'text-red-600',
              className,
            )}
          >
            <Info className="text-muted-foreground h-3.5 w-3.5" />
            <span className="text-muted-foreground">{label ?? 'Form Status'}</span>
            <Separator
              orientation="vertical"
              className="mx-2"
            />
            {isValid ? (
              <Dot className="h-2 w-2 rounded-full border border-green-600 bg-green-600" />
            ) : (
              <Dot className="border-destructive bg-destructive h-2 w-2 rounded-full border" />
            )}
            {isValid ? 'Valid' : 'Invalid'}
          </Badge>
        </HoverCardTrigger>
        <HoverCardContent className="bg-card w-full rounded-2xl border p-4 shadow-lg">
          <div className="flex items-center gap-2">
            <p className="text-foreground text-base font-medium">{label ?? 'Form Status'}</p>
            <span className={cn('h-2 w-2 rounded-full', isValid ? 'animate-pulse bg-green-500' : 'bg-destructive')} />
          </div>

          <p className={cn('mb-3 text-sm', isValid ? 'text-green-600' : 'text-destructive')}>
            {isValid ? 'All good! No errors detected.' : 'Oops! Some errors found.'}
          </p>

          {errorEntries?.length > 0 ? (
            <div className="bg-background overflow-y-auto rounded-sm border p-2">
              <ul className="space-y-2 text-xs">
                {errorEntries?.map(([name, error]) => (
                  <li
                    key={name}
                    className="flex items-start gap-1"
                  >
                    <span className="text-muted-foreground">
                      <Dot className="h-4 w-4" />
                    </span>
                    <span>
                      <strong className="capitalize">{name}</strong>
                      {' : '} {(error?.message ?? 'Invalid value').toString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-muted-foreground text-xs">
              {isValid && errors
                ? 'You can submit the form now.'
                : 'Oops! Some errors found.\n Submit the form to see more error details'}
            </p>
          )}
        </HoverCardContent>
      </HoverCard>
    </div>
  )
})

StatusBadge.displayName = 'StatusBadge'

const SubmitButton = ({ variant, label = 'Submit', isLoading, className, disabled }: SubmitButtonProps) => {
  return (
    <Button
      variant={variant}
      type="submit"
      disabled={disabled || isLoading}
      className={cn('', className)}
    >
      {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
      {!isLoading ? label : 'Submitting...'}
    </Button>
  )
}

SubmitButton.displayName = 'FormSubmitButton'

Form.Field = Field
Form.Submit = SubmitButton
Form.FormWatch = FormWatch
Form.FormWatchError = FormWatchError
Form.FieldsWrapper = FieldsWrapper
Form.FormContext = FormContext
Form.StatusBadge = StatusBadge

export default Form
