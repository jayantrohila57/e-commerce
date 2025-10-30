'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { toast } from 'sonner'
import { requestPasswordReset } from '@/core/auth/auth.client'

const forgotPasswordSchema = z.object({
  email: z.email().min(1),
})

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm() {
  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const { isSubmitting } = form.formState

  async function handleForgotPassword(data: ForgotPasswordForm) {
    await requestPasswordReset(
      {
        ...data,
        redirectTo: '/auth/reset-password',
      },
      {
        onError: (error) => {
          toast.error(error.error.message || 'Failed to send password reset email')
        },
        onSuccess: () => {
          toast.success('Password reset email sent')
        },
      },
    )
  }

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={void form.handleSubmit(handleForgotPassword)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Email'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
