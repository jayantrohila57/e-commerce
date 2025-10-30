import type { Route } from 'next'

type RouteTree = Route | ((...params: [string, ...string[]]) => Route) | { [key: string]: RouteTree }

export const PATH = {
  ROOT: '/',
  AUTH: {
    ROOT: '/auth',
    SIGN_IN: '/auth/sign-in',
    SIGN_UP: '/auth/sign-up',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    LOGOUT: '/auth/sign-out',
  },
  ACCOUNT: {
    ROOT: '/account',
    PROFILE: '/account/profile',
    SECURITY: '/account/security',
    SESSION: '/account/session',
  },
  STORE: {
    ROOT: '/store',
    PRODUCTS: {
      ROOT: '/store/products',
      PRODUCT: (productId: string) => `/store/products/${productId}`,
    },
  },
  STUDIO: {
    ROOT: '/studio',
  },
  BLOG: {
    ROOT: '/blog',
    POST: (slug: string) => `/blog/${slug}`,
    CATEGORIES: {
      ROOT: '/blog/categories',
      CATEGORY: (category: string) => `/blog/categories/${category}`,
    },
    TAGS: {
      ROOT: '/blog/tags',
      TAG: (tag: string) => `/blog/tags/${tag}`,
    },
  },
  SITE: {
    ROOT: '/',
    ABOUT: '/about',
    CONTACT: '/contact',
    LEGAL: {
      ROOT: '/legal',
      LICENSE: '/legal/licenses',
      PRIVACY: '/legal/privacy-policy',
      TERMS: '/legal/terms-of-service',
      COOKIES: '/legal/cookies-policy',
    },
    SUPPORT: {
      ROOT: '/support',
      CONTACT: '/support/contact-support',
      FAQ: '/support/faq',
      HELP_CENTER: '/support/help-center',
      TICKETS: {
        ROOT: '/support/tickets',
        TICKET: (ticketId: string) => `/support/tickets/${ticketId}`,
      },
    },
  },
  FEEDS: {
    RSS: '/rss.xml',
    SITEMAP: '/sitemap.xml',
  },
} as const satisfies RouteTree

export type AppRoutes = typeof PATH
