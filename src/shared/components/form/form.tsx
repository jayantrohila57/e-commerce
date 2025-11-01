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
import { Loader } from 'lucide-react'

export const Form = <T extends z.ZodTypeAny>(props: FormProps<T>) => {
  const { onSubmitAction, className, children, schema, defaultValues } = props

  const form = useForm({
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
        className={cn('h-[calc(100vh-9.8rem)] overflow-hidden', className)}
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

export default Form
