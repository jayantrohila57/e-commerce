import { apiServer, HydrateClient } from '@/core/api/api.server'
import CodePreview from '@/shared/components/common/code-preview'
import Section from '@/shared/components/layout/section/section'
import Shell from '@/shared/components/layout/shell'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Contact Support',
  description: 'Get in touch with us to discuss your project, ask a question, or simply to say hello.',
}

export default async function Page() {
  const { data } = await apiServer.product.getMany({
    query: {},
  })
  if (!data) return notFound()

  return (
    <HydrateClient>
      <Section>
        <CodePreview json={data} />
      </Section>
    </HydrateClient>
  )
}
