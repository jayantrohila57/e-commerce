import { Poppins as Font } from 'next/font/google'

const font = Font({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

const monoFont = Font({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  width: 'device-width',
  initialScale: 1,
}

const className = `${font.variable} ${monoFont.variable} antialiased`

export { font, viewport, className }
