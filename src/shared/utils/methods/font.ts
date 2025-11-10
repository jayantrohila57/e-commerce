import { Inter as Font, Oswald as SecondaryFont } from 'next/font/google'

const font = Font({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  weight: [ '400'],
})

const secondaryFont = SecondaryFont({
  subsets: ['latin'],
  variable: '--font-oswald-sans',
  weight: ['400', '500', '600', '700'],
})

const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  width: 'device-width',
  initialScale: 1,
}

const className = `${font.variable} antialiased`

export { font, viewport, className }
