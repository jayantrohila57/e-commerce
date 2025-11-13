import Section from '@/shared/components/layout/section/section'
import Image from 'next/image'

export default function SiteHero() {
  return (
    <Section separator={false}>
      <Image
        src={
          'https://images.unsplash.com/photo-1507553532144-b9df5e38c8d1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1213'
        }
        alt="Hero"
        width={1920}
        height={1080}
        className="aspect-video h-auto w-full object-cover"
      />
    </Section>
  )
}
