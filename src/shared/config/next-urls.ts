import type { Route } from 'next'

export const nextUrls = {
  ROOT: '/',
  AUTH: '/auth',
  LOGIN: '/auth/sign-in',
  REGISTER: '/auth/sign-up',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  ACCOUNT: '/account',
  PROFILE: '/account/profile',
  SECURITY: '/account/security',
  STORE: '/store',
  STUDIO: '/studio',
  BLOG: '/blog',
} as const satisfies Record<string, Route>

export type NextUrls = typeof nextUrls
