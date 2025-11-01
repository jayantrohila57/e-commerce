import { getServerSession } from '@/core/auth/auth.server'
import { AuthSignOutButton } from '@/module/auth/components/auth.sign-out-button'
import Section from '@/shared/components/layout/section/section'
import Shell from '@/shared/components/layout/shell'
import { Button } from '@/shared/components/ui/button'
import { PATH } from '@/shared/config/routes'
import Link from 'next/link'
import { FAQSection } from '@/module/site/site.faq'

import { Rocket, LifeBuoy, Palette, ShieldCheck, Layers } from 'lucide-react'
import { type Route } from 'next'
export const metadata = {
  title: 'Home',
  description: 'Home Description',
}
export default async function Home({}: PageProps<'/'>) {
  const { session, user } = await getServerSession()
  const data = {
    faq: {
      title: 'Frequently Asked Questions',
      description:
        'Answers to the most common questions about our services, pricing and process so you can start with clarity.',
      action: 'View All FAQs',
      data: [
        {
          id: '1',
          icon: Layers,
          title: 'What makes your agency different?',
          content:
            'We combine strategy, design, and engineering under one roof. Our process is transparent, our timelines are realistic, and we build digital experiences that actually move the needle for your business.',
        },
        {
          id: '2',
          icon: Palette,
          title: 'Can you adapt to our brand and style?',
          content:
            'Absolutely. We conduct brand immersion sessions to capture your tone, visuals, and audience before designing anything. The result feels like a natural extension of your identity.',
        },
        {
          id: '3',
          icon: Rocket,
          title: 'Do your websites perform well?',
          content:
            'Every site we launch is optimized for speed, SEO, and scalability. Clean code, lightweight assets, and best-practice hosting ensure your users enjoy fast, seamless experiences.',
        },
        {
          id: '4',
          icon: ShieldCheck,
          title: 'How do you handle security and reliability?',
          content:
            'We follow industry security standards, set up regular backups, and proactively monitor performance. Your data and your users stay protected around the clock.',
        },
        {
          id: '5',
          icon: LifeBuoy,
          title: 'What happens after launch?',
          content:
            'We don’t disappear. Our support plans include updates, feature enhancements, analytics reviews, and on-call help to keep your digital presence growing long after go-live.',
        },
      ],
    },
  }
  return (
    <Shell>
      <Shell.Section>
        <Section {...metadata}>
          <div className="my-6 px-4">
            <div className="space-y-6 text-left">
              {session == null ? (
                <div className="flex flex-row gap-4">
                  <Button
                    asChild
                    size="lg"
                  >
                    <Link href={PATH.AUTH.SIGN_IN}>Sign In</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                  >
                    <Link href={PATH.AUTH.SIGN_UP}>Sign Up</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                  >
                    <Link href={PATH.AUTH.FORGOT_PASSWORD}>Forgot Password</Link>
                  </Button>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold">Welcome {user?.name}!</h1>
                  <code className="whitespace-pre-wrap">{JSON.stringify({ session, user }, null, 2)}</code>
                  <div className="flex justify-center gap-4">
                    <Button
                      asChild
                      size="lg"
                    >
                      <Link href={PATH.ACCOUNT.PROFILE as Route}>Profile</Link>
                    </Button>
                    <AuthSignOutButton />
                  </div>
                </>
              )}
            </div>
          </div>
        </Section>
      </Shell.Section>
      <Shell.Section>
        <Section
          title={data.faq.title}
          description={data.faq.description}
          action={data.faq.action}
        >
          <FAQSection data={data.faq.data} />
        </Section>
      </Shell.Section>
    </Shell>
  )
}
