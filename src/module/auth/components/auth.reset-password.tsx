'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Button } from '@/shared/components/ui/button'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { resetPassword } from '@/core/auth/auth.client'
import { Input } from '@/shared/components/ui/input'
import { PATH } from '@/shared/config/routes'

const resetPasswordSchema = z.object({
  password: z.string().min(6),
})

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordForm({ token, error }: { token: string; error: string }) {
  const router = useRouter()

  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
    },
  })

  const { isSubmitting } = form.formState

  async function handleResetPassword(data: ResetPasswordForm) {
    if (token == null) return

    await resetPassword(
      {
        newPassword: data.password,
        token,
      },
      {
        onError: (error) => {
          toast.error(error.error.message || 'Failed to reset password')
        },
        onSuccess: () => {
          toast.success('Password reset successful', {
            description: 'Redirection to login...',
          })
          setTimeout(() => {
            router.push(PATH.AUTH.SIGN_IN)
          }, 1000)
        },
      },
    )
  }
  const handleSubmit = () => {
    form.handleSubmit(handleResetPassword)
  }

  if (token == null || error != null) {
    return (
      <div className="my-6 px-4">
        <Card className="mx-auto w-full max-w-md">
          <CardHeader>
            <CardTitle>Invalid Reset Link</CardTitle>
            <CardDescription>The password reset link is invalid or has expired.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              asChild
            >
              <Link href={PATH.AUTH.SIGN_IN}>Back to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="my-6 px-4">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Reset Your Password</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={handleSubmit}
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
