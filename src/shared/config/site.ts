import { clientEnv } from "./env.client";

export const siteConfig = {
  // Site Identity
  name: "ShopHub",
  domain: "shophub.com",
  description: "ShopHub is your premier online shopping destination for quality products and exceptional service.",
  
  // Contact Information
  contact: {
    email: "support@shophub.com",
    supportEmail: "support@shophub.com",
    noreplyEmail: "noreply@shophub.com",
    phone: "+1 (555) 123-4567",
    address: {
      line1: "123 Commerce Street",
      line2: "Suite 100",
      city: "San Francisco",
      state: "CA",
      postalCode: "94105",
      country: "United States"
    }
  },

  // URLs
  urls: {
    base: clientEnv.NEXT_PUBLIC_BASE_URL,
    website: "https://shophub.com",
    support: "https://shophub.com/support",
    help: "https://shophub.com/help",
    returns: "https://shophub.com/returns",
    shipping: "https://shophub.com/shipping",
    terms: "https://shophub.com/legal/terms",
    privacy: "https://shophub.com/legal/privacy",
    unsubscribe: "https://shophub.com/unsubscribe"
  },

  // Email Configuration
  email: {
    from: {
      name: "ShopHub",
      address: "noreply@shophub.com"
    },
    support: {
      name: "ShopHub Support",
      address: "support@shophub.com"
    },
    replyTo: "support@shophub.com",
    footer: {
      company: "ShopHub Inc.",
      address: "123 Commerce Street, Suite 100, San Francisco, CA 94105, United States",
      unsubscribe: "If you no longer wish to receive these emails, you can unsubscribe here.",
      privacy: "Privacy Policy",
      terms: "Terms of Service"
    }
  },

  // Social Media
  socialLinks: [
    {
      name: "Facebook",
      url: "https://facebook.com/shophub",
      icon: "facebook"
    },
    {
      name: "Instagram", 
      url: "https://instagram.com/shophub",
      icon: "instagram"
    },
    {
      name: "Twitter",
      url: "https://twitter.com/shophub",
      icon: "twitter"
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/company/shophub",
      icon: "linkedin"
    },
    {
      name: "YouTube",
      url: "https://youtube.com/@shophub",
      icon: "youtube"
    }
  ],

  // Brand Colors
  colors: {
    primary: "#3b82f6",
    secondary: "#64748b", 
    success: "#22c55e",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#06b6d4",
    background: "#f9fafb",
    text: "#111827",
    textMuted: "#6b7280"
  },

  // Business Info
  business: {
    hours: "Mon-Fri 9AM-6PM EST",
    freeShippingThreshold: 50,
    returnPolicy: "30-day return policy",
    paymentMethods: ["Visa", "Mastercard", "American Express", "PayPal", "Apple Pay", "Google Pay"]
  },

  // Legal
  legal: {
    companyName: "ShopHub Inc.",
    taxId: "12-3456789",
    lastUpdated: "March 2026"
  }
};

// Legacy exports for backward compatibility
export const site = {
  name: siteConfig.name,
  address: `${siteConfig.contact.address.line1}, ${siteConfig.contact.address.city}, ${siteConfig.contact.address.state} ${siteConfig.contact.address.postalCode}`,
  phone: siteConfig.contact.phone,
  email: siteConfig.contact.email,
  description: siteConfig.description,
  url: clientEnv.NEXT_PUBLIC_BASE_URL,
  legalUpdate: siteConfig.legal.lastUpdated,
  apiTitle: `${siteConfig.name} API`,
  apiVersion: "1.0.0",
  socialLinks: siteConfig.socialLinks.map(link => link.url),
};

export type SiteConfig = typeof siteConfig;
