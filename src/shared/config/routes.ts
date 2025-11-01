import { type Route } from 'next'

export const PATH = {
  ROOT: '/',
  AUTH: {
    ROOT: '/auth',
    SIGN_IN: '/auth/sign-in',
    SIGN_UP: '/auth/sign-up',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },
  ACCOUNT: {
    ROOT: '/account',
    PROFILE: '/account/profile',
    SECURITY: '/account/security',
    SESSIONS: '/account/sessions',
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
      SLUG: (slug: string) => `/legal/${slug}`,
      LICENSE: '/legal/licenses' as Route,
      PRIVACY: '/legal/privacy-policy' as Route,
      TERMS: '/legal/terms-of-service' as Route,
      COOKIES: '/legal/cookies-policy' as Route,
      REFUND: '/legal/refund-policy' as Route,
      RETURN: '/legal/return-policy' as Route,
      SHIPPING: '/legal/shipping-policy' as Route,
      USER_AGREEMENT: '/legal/user-agreement' as Route,
      DATA_PROTECTION: '/legal/data-protection' as Route,
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
} as const

export type AppRoutes = typeof PATH
