import { env } from './env'

export const site = {
  name: 'Logo',
  address: 'Address, location, Montreal, Canada',
  phone: '+1 514-288-2666',
  email: 'hello@example.com',
  description: 'Logo is a leading e-commerce company based in Montreal, Canada.',
  url: env.NEXT_PUBLIC_BASE_URL,
  legalUpdate: 'Last updated: October 2025',
  apiTitle: 'Logo API',
  apiVersion: '1.0.0',
  socialLinks: [
    'https://github.com/',
    'https://www.instagram.com/',
    'https://www.facebook.com/',
    'https://twitter.com/',
    'https://www.linkedin.com/',
  ],
}
