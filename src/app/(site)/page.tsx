import SiteHero from '@/module/site/site.hero'
import Shell from '@/shared/components/layout/shell'

export const metadata = {
  title: 'Home',
  description: 'Home Description',
}

export default async function Home({}: PageProps<'/'>) {
  return (
    <Shell>
      <Shell.Section variant={'full'}>
        <SiteHero />
      </Shell.Section>
    </Shell>
  )
}
