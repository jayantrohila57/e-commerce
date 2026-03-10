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
      ROOT: "/studio/catalog/products",
      NEW: "/studio/catalog/products/add-new-product",
      VIEW: (slug: string) => `/studio/catalog/products/${slug}`,
      EDIT: (slug: string, id: string) => `/studio/catalog/products/${slug}/edit-product?id=${id}`,
      VARIANTS: {
        NEW: (productId: string, slug: string) => `/studio/catalog/products/${slug}/add-new-variant?id=${productId}`,
        VIEW: (productSlug: string, variantSlug: string) => `/studio/catalog/products/${productSlug}/${variantSlug}`,
        EDIT: (productSlug: string, variantSlug: string, variantId: string) =>
          `/studio/catalog/products/${productSlug}/${variantSlug}/edit-variant?id=${variantId}`,
      },
    },
    CATEGORIES: {
      ROOT: "/studio/catalog/categories",
      NEW: "/studio/catalog/categories/add-new-category",
      EDIT: (slug: string, id: string) => `/studio/catalog/categories/${slug}/edit-category?id=${id}`,
    },
    SUB_CATEGORIES: {
      ROOT: (categorySlug: string) => `/studio/catalog/categories/${categorySlug}`,
      NEW: (categoryId: string, categorySlug: string) =>
        `/studio/catalog/categories/${categorySlug}/add-new-subcategory?id=${categoryId}`,
      EDIT: (subcategorySlug: string, categorySlug: string, subcategoryId: string) =>
        `/studio/catalog/categories/${categorySlug}/${subcategorySlug}/edit-subcategory?id=${subcategoryId}`,
    },
    SERIES: {
      ROOT: (categorySlug: string, subCategorySlug: string, seriesSlug: string) =>
        `/studio/catalog/categories/${categorySlug}/${subCategorySlug}/${seriesSlug}`,
      NEW: (categorySlug: string, subCategorySlug: string, subCategoryId: string) =>
        `/studio/catalog/categories/${categorySlug}/${subCategorySlug}/add-new-series?id=${subCategoryId}`,
      EDIT: (categorySlug: string, subCategorySlug: string, seriesSlug: string) =>
        `/studio/catalog/categories/${categorySlug}/${subCategorySlug}/${seriesSlug}/edit`,
    },
    INVENTORY: {
      ROOT: "/studio/inventory",
      NEW: "/studio/inventory/new",
      SLUG: (id: string) => `/studio/inventory/${id}`,
      EDIT: (id: string) => `/studio/inventory/${id}/edit-inventory`,
    },
    ATTRIBUTES: {
      ROOT: "/studio/catalog/attributes",
      NEW: "/studio/catalog/attributes/add-new-attribute",
      EDIT: (slug: string, id: string) => `/studio/catalog/attributes/${slug}/edit-attribute?id=${id}`,
    },

    ORDERS: {
      ROOT: "/studio/orders",
      VIEW: (id: string) => `/studio/orders/${id}`,
    },

    USERS: {
      ROOT: "/studio/users",
      VIEW: (id: string) => `/studio/users/${id}`,
    },

    DISCOUNTS: {
      ROOT: "/studio/discounts",
      NEW: "/studio/discounts/new",
      EDIT: (id: string) => `/studio/discounts/${id}/edit`,
    },

    SHIPPING: {
      ROOT: "/studio/shipping",
      VIEW: (id: string) => `/studio/shipping/${id}`,
      EDIT: (id: string) => `/studio/shipping/${id}/edit`,
    },

    PAYMENT: {
      ROOT: "/studio/payment",
      VIEW: (id: string) => `/studio/payment/${id}`,
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
