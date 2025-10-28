'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'

import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { signIn } from '@/core/auth/auth.client'
import { SUPPORTED_OAUTH_PROVIDER_DETAILS } from '@/core/auth/auth.providers'
import { Github } from 'lucide-react'

const signInSchema = z.object({
  email: z.email().min(1),
  password: z.string().min(6)
})

type SignInForm = z.infer<typeof signInSchema>

export function SignInForm() {
  const router = useRouter()
  const form = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })
  const openEmailVerificationTab = (email: string) => {}
  const openForgotPassword = () => {}

  const { isSubmitting } = form.formState

  async function handleSignIn(data: SignInForm) {
    await signIn.email(
      { ...data, callbackURL: '/' },
      {
        onError: (error) => {
          if (error.error.code === 'EMAIL_NOT_VERIFIED') {
            openEmailVerificationTab(data.email)
          }
          toast.error(error.error.message || 'Failed to sign in')
        },
        onSuccess: () => {
          router.push('/')
        }
      }
    )
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleSignIn)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email webauthn"
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
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Button
                    onClick={openForgotPassword}
                    type="button"
                    variant="link"
                    size="sm"
                    className="text-sm font-normal underline">
                    Forgot password?
                  </Button>
                </div>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="current-password webauthn"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </Form>
      <div className="">
        <Button
          variant="outline"
          onClick={() => {
            return signIn.social({
              provider: 'github',
              callbackURL: '/'
            })
          }}>
          <Github />
          {SUPPORTED_OAUTH_PROVIDER_DETAILS['github'].name}
        </Button>
      </div>
    </div>
  )
}
