import { CreditCard, type LucideIcon, Mail, Package, RefreshCw, Shield, Truck } from "lucide-react";
import { PATH } from "@/shared/config/routes";
import { site, siteConfig } from "@/shared/config/site";

export type SupportFaqItem = {
  id: string;
  title: string;
  content: string;
  icon: LucideIcon;
};

export const supportFaqItems: SupportFaqItem[] = [
  {
    id: "orders",
    title: "Where is my order?",
    icon: Package,
    content: `Sign in and open ${site.name} orders under your account to see status and tracking. If you checked out as a guest, use the link in your confirmation email or contact us with your order number.`,
  },
  {
    id: "shipping",
    title: "How long does shipping take?",
    icon: Truck,
    content: `Typical handling and delivery depend on your location and the shipping method selected at checkout. See our shipping policy (${PATH.SITE.LEGAL.SHIPPING}) and the shipping information page for timelines and costs.`,
  },
  {
    id: "returns",
    title: "How do I return or exchange an item?",
    icon: RefreshCw,
    content: `We follow the return window and conditions in our return policy (${PATH.SITE.LEGAL.RETURN}). Start from your order details when signed in, or reach out via ${siteConfig.contact.supportEmail} with your order number.`,
  },
  {
    id: "payment",
    title: "What payment methods do you accept?",
    icon: CreditCard,
    content: `We support major cards and trusted checkout partners shown at payment time. All charges are processed securely; you’ll receive a confirmation email after a successful payment.`,
  },
  {
    id: "privacy",
    title: "How do you use my data?",
    icon: Shield,
    content: `We explain collection, use, and your rights in our privacy policy (${PATH.SITE.LEGAL.PRIVACY}). You can manage marketing preferences and account data from your account settings where available.`,
  },
  {
    id: "contact",
    title: "How can I reach support?",
    icon: Mail,
    content:
      `Email ${siteConfig.contact.supportEmail} or use our contact page. ${siteConfig.business.hours ? `We’re generally available ${siteConfig.business.hours}.` : ""}`.trim(),
  },
];

export const supportQuickLinks = [
  {
    title: "Contact us",
    description: "Email, hours, and how we can help.",
    href: PATH.SITE.CONTACT,
  },
  {
    title: "FAQs",
    description: "Quick answers about orders, shipping, and returns.",
    href: PATH.SITE.SUPPORT.FAQ,
  },
  {
    title: "Shipping",
    description: "Delivery options and timelines.",
    href: "/support/shipping" as const,
  },
  {
    title: "Returns",
    description: "Returns, refunds, and exchanges.",
    href: "/support/returns" as const,
  },
  {
    title: "Size guide",
    description: "How to measure for the best fit.",
    href: PATH.SITE.SUPPORT.SIZE_GUIDE,
  },
  {
    title: "Help center",
    description: "Browse topics and policies in one place.",
    href: PATH.SITE.SUPPORT.HELP_CENTER,
  },
] as const;

export function supportContactSummary() {
  return {
    email: siteConfig.contact.supportEmail,
    phone: siteConfig.contact.phone,
    hours: siteConfig.business.hours,
    address: `${siteConfig.contact.address.line1}, ${siteConfig.contact.address.city}, ${siteConfig.contact.address.state} ${siteConfig.contact.address.postalCode}`,
  };
}
