import type { Route } from "next";

export const PATH = {
  ROOT: "/",
  AUTH: {
    ROOT: "/auth",
    SIGN_IN: "/auth/sign-in",
    SIGN_UP: "/auth/sign-up",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: "/auth/verify-email",
  },
  ACCOUNT: {
    ROOT: "/account",
    USER: "/account/user" as Route,
    COMMERCE: "/account/commerce" as Route,
    PROFILE: "/account/user/profile" as Route,
    SECURITY: "/account/user/security" as Route,
    SESSIONS: "/account/user/sessions" as Route,
    CART: "/account/commerce/cart" as Route,
    WISHLIST: "/account/commerce/wishlist" as Route,
    ORDER: "/account/commerce/order" as Route,
    PAYMENT: "/account/commerce/payment" as Route,
    ADDRESS: "/account/commerce/address" as Route,
    ADDRESS_NEW: "/account/commerce/address/new" as Route,
    ADDRESS_EDIT: (id: string) => `/account/commerce/address/${id}/edit`,
    REVIEW: "/account/commerce/review" as Route,
    SETTINGS: "/account/user/settings" as Route,
    SHIPMENT: "/account/commerce/shipment" as Route,
  },
  STORE: {
    ROOT: "/store",
    CHECKOUT: {
      ROOT: "/store/checkout" as Route,
      CONFIRMATION: "/store/checkout/confirmation" as Route,
    },
    ORDER: {
      ROOT: "/store/order",
      DETAIL: (orderId: string) => `/store/order/${orderId}`,
    },
    PRODUCTS: {
      ROOT: "/store/products",
      PRODUCT: (productId: string) => `/store/products/${productId}`,
    },
    CATEGORIES: {
      ROOT: "/store/categories",
      CATEGORY: (categorySlug: string) => `/store/${categorySlug}`,
    },
    SUB_CATEGORIES: {
      ROOT: (categorySlug: string) => `/store/${categorySlug}`,
      SUBCATEGORY: (subcategorySlug: string, categorySlug: string) => `/store/${categorySlug}/${subcategorySlug}`,
    },
    ATTRIBUTES: {
      ROOT: "/store/attributes",
      ATTRIBUTE: (attributeSlug: string) => `/store/attributes/${attributeSlug}`,
    },
  },
  STUDIO: {
    ROOT: "/studio",
    PRODUCTS: {
      ROOT: "/studio/products",
      NEW: "/studio/products/new",
      VIEW: (slug: string) => `/studio/products/${slug}`,
      EDIT: (slug: string, id: string) => `/studio/products/${slug}/edit?id=${id}`,
      VARIANTS: {
        NEW: (productId: string, slug: string) => `/studio/products/${slug}/new?id=${productId}`,
        VIEW: (productSlug: string, variantSlug: string) => `/studio/products/${productSlug}/${variantSlug}`,
        EDIT: (productSlug: string, variantSlug: string, variantId: string) =>
          `/studio/products/${productSlug}/${variantSlug}/edit?id=${variantId}`,
      },
    },
    CATEGORIES: {
      ROOT: "/studio/products/categories",
      NEW: "/studio/products/categories/new",
      EDIT: (slug: string, id: string) => `/studio/products/categories/${slug}/edit?id=${id}`,
    },
    SUB_CATEGORIES: {
      ROOT: (categorySlug: string) => `/studio/products/categories/${categorySlug}`,
      NEW: (categoryId: string, categorySlug: string) =>
        `/studio/products/categories/${categorySlug}/new?id=${categoryId}`,
      EDIT: (subcategorySlug: string, categorySlug: string, subcategoryId: string) =>
        `/studio/products/categories/${categorySlug}/${subcategorySlug}/edit?id=${subcategoryId}`,
    },
    SERIES: {
      ROOT: (categorySlug: string, subCategorySlug: string, seriesSlug: string) =>
        `/studio/products/categories/${categorySlug}/${subCategorySlug}/${seriesSlug}`,
      NEW: (categorySlug: string, subCategorySlug: string, subCategoryId: string) =>
        `/studio/products/categories/${categorySlug}/${subCategorySlug}/new?id=${subCategoryId}`,
      EDIT: (categorySlug: string, subCategorySlug: string, seriesSlug: string) =>
        `/studio/products/categories/${categorySlug}/${subCategorySlug}/${seriesSlug}/edit`,
    },
    INVENTORY: {
      ROOT: "/studio/products/inventory",
      NEW: "/studio/products/inventory/new",
      SLUG: (id: string) => `/studio/products/inventory/${id}`,
      EDIT: (id: string) => `/studio/products/inventory/${id}/edit`,
    },
    ATTRIBUTES: {
      ROOT: "/studio/products/attributes",
      NEW: "/studio/products/attributes/new",
      EDIT: (slug: string, id: string) => `/studio/products/attributes/${slug}/edit?id=${id}`,
    },

    ORDERS: {
      ROOT: "/studio/orders",
      VIEW: (id: string) => `/studio/orders/${id}`,
    },

    CUSTOMERS: {
      ROOT: "/studio/customers",
      VIEW: (id: string) => `/studio/customers/${id}`,
    },

    DISCOUNTS: {
      ROOT: "/studio/discounts",
      NEW: "/studio/discounts/new",
      EDIT: (id: string) => `/studio/discounts/${id}/edit`,
    },

    SHIPPING: {
      ROOT: "/studio/shipping",
      EDIT: (id: string) => `/studio/shipping/${id}/edit`,
    },

    PAYMENTS: {
      ROOT: "/studio/payments",
      VIEW: (id: string) => `/studio/payments/${id}`,
    },

    MARKETING: {
      ROOT: "/studio/marketing",
      CAMPAIGNS: "/studio/marketing/campaigns",
      NEWSLETTERS: {
        ROOT: "/studio/marketing/newsletters",
        NEW: "/studio/marketing/newsletters/new",
        EDIT: (id: string) => `/studio/marketing/newsletters/${id}/edit`,
      },
      PROMOTIONS: {
        ROOT: "/studio/marketing/promotions",
        NEW: "/studio/marketing/promotions/new",
        EDIT: (id: string) => `/studio/marketing/promotions/${id}/edit`,
      },
      COUPONS: {
        ROOT: "/studio/marketing/coupons",
        NEW: "/studio/marketing/coupons/new",
        EDIT: (id: string) => `/studio/marketing/coupons/${id}/edit`,
      },
      EMAIL_TEMPLATES: {
        ROOT: "/studio/marketing/email-templates",
        NEW: "/studio/marketing/email-templates/new",
        EDIT: (id: string) => `/studio/marketing/email-templates/${id}/edit`,
      },
    },

    ANALYTICS: {
      ROOT: "/studio/analytics",
      SALES: "/studio/analytics/sales",
      CUSTOMERS: "/studio/analytics/customers",
    },

    SETTINGS: {
      ROOT: "/studio/settings",
      ACCOUNT: {
        ROOT: "/studio/settings/account",
        PROFILE: "/studio/settings/account/profile",
        TEAM: "/studio/settings/account/team",
      },
      USERS: {
        ROOT: "/studio/settings/users",
        NEW: "/studio/settings/users/new",
        EDIT: (id: string) => `/studio/settings/users/${id}/edit`,
      },
      GENERAL: {
        ROOT: "/studio/settings/general",
        APPEARANCE: "/studio/settings/general/appearance",
        LANGUAGE: "/studio/settings/general/language",
        TIMEZONE: "/studio/settings/general/timezone",
        DATE_FORMAT: "/studio/settings/general/date-format",
        TIME_FORMAT: "/studio/settings/general/time-format",
        CURRENCY: "/studio/settings/general/currency",
        CURRENCY_SYMBOL: "/studio/settings/general/currency-symbol",
        CURRENCY_SYMBOL_POSITION: "/studio/settings/general/currency-symbol-position",
      },
      NOTIFICATIONS: {
        ROOT: "/studio/settings/notifications",
        EMAIL: "/studio/settings/notifications/email",
      },
      SECURITY: {
        ROOT: "/studio/settings/security",
        TWO_FACTOR_AUTH: "/studio/settings/security/two-factor-auth",
        PASSWORD: "/studio/settings/security/password",
        DEVICE_SESSIONS: "/studio/settings/security/device-sessions",
        DEVICE_SESSIONS_NEW: "/studio/settings/security/device-sessions/new",
        DEVICE_SESSIONS_EDIT: (id: string) => `/studio/settings/security/device-sessions/${id}/edit`,
        DEVICE_SESSIONS_VIEW: (id: string) => `/studio/settings/security/device-sessions/${id}`,
        DEVICE_SESSIONS_DELETE: (id: string) => `/studio/settings/security/device-sessions/${id}/delete`,
      },
    },
  },
  BLOG: {
    ROOT: "/blog",
    POST: (slug: string) => `/blog/${slug}`,
    CATEGORIES: {
      ROOT: "/blog/categories",
      CATEGORY: (category: string) => `/blog/categories/${category}`,
    },
    TAGS: {
      ROOT: "/blog/tags",
      TAG: (tag: string) => `/blog/tags/${tag}`,
    },
  },
  SITE: {
    ROOT: "/",
    FORBIDDEN: "/forbidden" as Route,
    ABOUT: "/about",
    CONTACT: "/contact",
    LEGAL: {
      ROOT: "/legal",
      SLUG: (slug: string) => `/legal/${slug}`,
      LICENSE: "/legal/licenses" as Route,
      PRIVACY: "/legal/privacy-policy" as Route,
      TERMS: "/legal/terms-of-service" as Route,
      COOKIES: "/legal/cookies-policy" as Route,
      REFUND: "/legal/refund-policy" as Route,
      RETURN: "/legal/return-policy" as Route,
      SHIPPING: "/legal/shipping-policy" as Route,
      USER_AGREEMENT: "/legal/user-agreement" as Route,
      DATA_PROTECTION: "/legal/data-protection" as Route,
    },
    SUPPORT: {
      ROOT: "/support",
      CONTACT: "/support/contact-support",
      FAQ: "/support/faq",
      HELP_CENTER: "/support/help-center",
      TICKETS: {
        ROOT: "/support/tickets",
        TICKET: (ticketId: string) => `/support/tickets/${ticketId}`,
      },
    },
  },
  FEEDS: {
    RSS: "/rss.xml",
    SITEMAP: "/sitemap.xml",
  },
} as const;
