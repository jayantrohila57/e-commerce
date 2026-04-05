import { clientEnv } from "./env.client";

export const siteConfig = {
  // Site Identity
  name: "Lucsum",
  domain: "lucsum.com",
  description: "Lucsum is a modern commerce brand built to feel focused, trustworthy, and unmistakably present.",

  // Contact Information
  contact: {
    email: "support@lucsum.com",
    supportEmail: "support@lucsum.com",
    noreplyEmail: "noreply@lucsum.com",
    phone: "+1 (555) 123-4567",
    address: {
      line1: "123 Commerce Street",
      line2: "Suite 100",
      city: "San Francisco",
      state: "CA",
      postalCode: "94105",
      country: "United States",
    },
  },

  // URLs
  urls: {
    base: clientEnv.NEXT_PUBLIC_BASE_URL,
    website: "https://lucsum.com",
    support: "https://lucsum.com/support",
    help: "https://lucsum.com/help",
    returns: "https://lucsum.com/returns",
    shipping: "https://lucsum.com/shipping",
    terms: "https://lucsum.com/legal/terms",
    privacy: "https://lucsum.com/legal/privacy",
    unsubscribe: "https://lucsum.com/unsubscribe",
  },

  // Email Configuration
  email: {
    from: {
      name: "Lucsum",
      address: "noreply@lucsum.com",
    },
    support: {
      name: "Lucsum Support",
      address: "support@lucsum.com",
    },
    replyTo: "support@lucsum.com",
    footer: {
      company: "Lucsum",
      address: "123 Commerce Street, Suite 100, San Francisco, CA 94105, United States",
      unsubscribe: "If you no longer wish to receive these emails, you can unsubscribe here.",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
    },
  },

  // Social Media
  socialLinks: [
    {
      name: "Facebook",
      url: "https://facebook.com/lucsum",
      icon: "facebook",
    },
    {
      name: "Instagram",
      url: "https://instagram.com/lucsum",
      icon: "instagram",
    },
    {
      name: "Twitter",
      url: "https://twitter.com/lucsum",
      icon: "twitter",
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/company/lucsum",
      icon: "linkedin",
    },
    {
      name: "YouTube",
      url: "https://youtube.com/@lucsum",
      icon: "youtube",
    },
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
    textMuted: "#6b7280",
  },

  // Business Info
  business: {
    hours: "Mon-Fri 9AM-6PM EST",
    freeShippingThreshold: 50,
    returnPolicy: "30-day return policy",
    paymentMethods: ["Visa", "Mastercard", "American Express", "PayPal", "Apple Pay", "Google Pay"],
  },

  // Legal
  legal: {
    companyName: "Lucsum",
    taxId: "12-3456789",
    lastUpdated: "March 2026",
  },
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
  socialLinks: siteConfig.socialLinks.map((link) => link.url),
};

export type SiteConfig = typeof siteConfig;
