'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { toast } from 'sonner'
import { signUp } from '@/core/auth/auth.client'
import { useRouter } from 'next/navigation'

const signUpSchema = z.object({
  name: z.string().min(1),
  email: z.email().min(1),
  password: z.string().min(6),
  favoriteNumber: z.string().nullable(),
})

type SignUpForm = z.infer<typeof signUpSchema>

export function SignUpForm() {
  const router = useRouter()
  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      favoriteNumber: '2',
    },
  })

  const openEmailVerificationTab = (email: string) => {
    return email
  }
  const { isSubmitting } = form.formState

  async function handleSignUp(data: SignUpForm) {
    const res = await signUp.email(
      { ...data },
      {
        onSuccess: ({ data }) => {
          router.push(`/auth/verify-email?email=${data?.user?.email}`)
          toast.success('Sign up successful')
        },
        onError: (error) => {
          toast.error(error.error.message || 'Failed to sign up')
        },
      },
    )

    if (res.error == null && !res.data.user.emailVerified) {
      openEmailVerificationTab(data.email)
    }
  }

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={void form.handleSubmit(handleSignUp)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
          className="w-full"
        >
          {isSubmitting ? 'Loading...' : 'Sign Up'}
        </Button>
      </form>
    </Form>
  )
}
