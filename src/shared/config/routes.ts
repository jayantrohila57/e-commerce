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
    USER: '/account/user' as Route,
    COMMERCE: '/account/commerce' as Route,
    PROFILE: '/account/user/profile' as Route,
    SECURITY: '/account/user/security' as Route,
    SESSIONS: '/account/user/sessions' as Route,
    CART: '/account/commerce/cart' as Route,
    WISHLIST: '/account/commerce/wishlist' as Route,
    ORDER: '/account/commerce/order' as Route,
    ADDRESS: '/account/commerce/address' as Route,
    REVIEW: '/account/commerce/review' as Route,
    SETTINGS: '/account/user/settings' as Route,
    SHIPMENT: '/account/commerce/shipment' as Route,
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

    PRODUCTS: {
      ROOT: '/studio/products',
      NEW: '/studio/products/new',
      EDIT: (id: string) => `/studio/products/${id}/edit`,
    },

    CATEGORIES: {
      ROOT: '/studio/categories',
      NEW: '/studio/categories/new',
      EDIT: (id: string) => `/studio/categories/${id}/edit`,
    },

    ORDERS: {
      ROOT: '/studio/orders',
      VIEW: (id: string) => `/studio/orders/${id}`,
    },

    CUSTOMERS: {
      ROOT: '/studio/customers',
      VIEW: (id: string) => `/studio/customers/${id}`,
    },

    DISCOUNTS: {
      ROOT: '/studio/discounts',
      NEW: '/studio/discounts/new',
      EDIT: (id: string) => `/studio/discounts/${id}/edit`,
    },

    SHIPPING: {
      ROOT: '/studio/shipping',
      EDIT: (id: string) => `/studio/shipping/${id}/edit`,
    },

    PAYMENTS: {
      ROOT: '/studio/payments',
      VIEW: (id: string) => `/studio/payments/${id}`,
    },

    MARKETING: {
      ROOT: '/studio/marketing',
      CAMPAIGNS: '/studio/marketing/campaigns',
    },

    ANALYTICS: {
      ROOT: '/studio/analytics',
      SALES: '/studio/analytics/sales',
      CUSTOMERS: '/studio/analytics/customers',
    },

    SETTINGS: {
      ROOT: '/studio/settings',
      PROFILE: '/studio/settings/profile',
      TEAM: '/studio/settings/team',
    },
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
