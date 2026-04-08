import { FileText, Lock, Mail, Shield, ShoppingBag, Truck, Undo, User } from "lucide-react";
import type { Route } from "next";
import { PATH } from "@/shared/config/routes";

interface PolicySection {
  heading: string;
  content: string[];
  list?: string[];
}

interface PolicyContent {
  id: string;
  href: Route;
  title: string;
  description: string;
  icon: React.ReactNode;
  lastUpdated: string;
  tableOfContents: string[];
  sections: PolicySection[];
}

type PolicyType = keyof typeof policyContent;

export const getMetadata = (activeSection: unknown) => {
  const slug = activeSection as PolicyType;

  if (!slug) {
    return {
      title: "Policy Not Found",
      description: "We couldn’t find the policy you’re looking for. Check the URL or explore other policies.",
    };
  }
  const content = policyContent[slug];
  if (!content) {
    return {
      title: "Policy Not Found",
      description: "This policy doesn’t exist or may have been moved.",
    };
  }
  return {
    title: content.title,
    description: content.description,
  };
};
export const policyContent: Record<string, PolicyContent> = {
  legal: {
    id: "legal",
    href: PATH.SITE.LEGAL.ROOT,
    title: "Legal",
    icon: <FileText className="h-6 w-6" />,
    description: "Policies, terms, and compliance information for shopping with us.",
    sections: [],
    tableOfContents: [],
    lastUpdated: "—",
  },
  "terms-of-service": {
    id: "terms-of-service",
    href: PATH.SITE.LEGAL.TERMS,
    title: "Terms & Conditions",
    icon: <FileText className="h-6 w-6" />,
    description:
      "Welcome to our e-commerce platform. By accessing or using our website, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services.",
    lastUpdated: "October 15, 2024",
    tableOfContents: [
      "Acceptance of Terms",
      "User Obligations",
      "Account Registration",
      "Product Information",
      "Payment and Pricing",
      "Prohibited Activities",
      "Intellectual Property",
      "Limitation of Liability",
    ],
    sections: [
      {
        heading: "1. Acceptance of Terms",
        content: [
          "Welcome to our e-commerce platform. By accessing or using our website, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services.",
          "These terms constitute a legally binding agreement between you and our company. We reserve the right to modify these terms at any time, and it is your responsibility to review them periodically.",
        ],
      },
      {
        heading: "2. User Obligations",
        content: [
          "As a user of our platform, you agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.",
          "You are responsible for maintaining the confidentiality of your account and password, and for restricting access to your computer or device.",
        ],
        list: [
          "Provide accurate personal and payment information",
          "Maintain the security of your account credentials",
          "Notify us immediately of any unauthorized use of your account",
          "Accept responsibility for all activities that occur under your account",
        ],
      },
      {
        heading: "3. Account Registration",
        content: [
          "To access certain features of our platform, you may be required to create an account. You must be at least 18 years old to create an account and make purchases.",
          "You agree to provide truthful information and maintain the accuracy of your account details. Accounts that violate our policies may be suspended or terminated without notice.",
        ],
      },
      {
        heading: "4. Product Information",
        content: [
          "We strive to provide accurate product descriptions, images, and pricing. However, we do not warrant that product descriptions or other content on our website is accurate, complete, reliable, current, or error-free.",
          "If a product offered by us is not as described, your sole remedy is to return it in unused condition for a refund or exchange in accordance with our Return Policy.",
        ],
      },
      {
        heading: "5. Payment and Pricing",
        content: [
          "All prices are displayed in the local currency and include applicable taxes unless otherwise stated. We reserve the right to change prices at any time without prior notice.",
          "Payment must be received by us before your order is dispatched. We accept various payment methods including credit cards, debit cards, and digital wallets. All transactions are processed securely through our payment partners.",
        ],
      },
      {
        heading: "6. Prohibited Activities",
        content: ["You agree not to engage in any of the following prohibited activities:"],
        list: [
          "Using the platform for any unlawful purpose or in violation of these Terms",
          "Attempting to gain unauthorized access to any portion of the platform",
          "Interfering with or disrupting the platform or servers",
          "Impersonating any person or entity",
          "Uploading viruses or malicious code",
          "Collecting or harvesting any personally identifiable information",
          "Using the platform for commercial purposes without authorization",
        ],
      },
      {
        heading: "7. Intellectual Property",
        content: [
          "All content on this platform, including text, graphics, logos, images, and software, is the property of our company or its content suppliers and is protected by international copyright laws.",
          "You may not reproduce, distribute, modify, create derivative works of, publicly display, or exploit any of our content without our express written permission.",
        ],
      },
      {
        heading: "8. Limitation of Liability",
        content: [
          "To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the platform.",
          "Our total liability to you for all claims arising from or related to the platform shall not exceed the amount you paid us in the twelve months preceding the claim.",
        ],
      },
    ],
  },
  "privacy-policy": {
    id: "privacy-policy",
    href: PATH.SITE.LEGAL.PRIVACY,
    title: "Privacy Policy",
    icon: <Lock className="h-6 w-6" />,
    lastUpdated: "October 15, 2024",
    description:
      "This Privacy Policy outlines how we collect, use, and protect your personal information when you use our e-commerce platform.",
    tableOfContents: [
      "Information We Collect",
      "How We Use Your Information",
      "Information Sharing",
      "Data Security",
      "Your Rights",
      "Cookies and Tracking",
      "Third-Party Links",
      "Changes to Privacy Policy",
    ],
    sections: [
      {
        heading: "1. Information We Collect",
        content: [
          "We collect various types of information to provide and improve our services to you. This includes information you provide directly, information we collect automatically, and information from third-party sources.",
        ],
        list: [
          "Personal information: name, email address, phone number, shipping address",
          "Payment information: credit card details, billing address",
          "Account information: username, password, purchase history",
          "Technical information: IP address, browser type, device information",
          "Usage data: pages visited, time spent on site, click patterns",
        ],
      },
      {
        heading: "2. How We Use Your Information",
        content: [
          "We use the information we collect for various purposes related to providing, maintaining, and improving our services:",
        ],
        list: [
          "Processing and fulfilling your orders",
          "Communicating with you about your purchases and account",
          "Providing customer support and responding to inquiries",
          "Personalizing your shopping experience",
          "Sending promotional materials and special offers (with your consent)",
          "Improving our website and services",
          "Detecting and preventing fraud",
          "Complying with legal obligations",
        ],
      },
      {
        heading: "3. Information Sharing",
        content: [
          "We do not sell your personal information to third parties. We may share your information with trusted partners who assist us in operating our website, conducting our business, or serving our users.",
          "These parties are obligated to keep your information confidential and use it only for the purposes for which we disclose it to them.",
        ],
        list: [
          "Payment processors for secure transaction handling",
          "Shipping companies for order fulfillment",
          "Marketing partners (with your explicit consent)",
          "Legal authorities when required by law",
          "Service providers who help us operate our business",
        ],
      },
      {
        heading: "4. Data Security",
        content: [
          "We implement a variety of security measures to maintain the safety of your personal information. Your data is stored on secure servers and we use encryption technology to protect sensitive information transmitted online.",
          "However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.",
        ],
      },
      {
        heading: "5. Your Rights",
        content: ["You have certain rights regarding your personal information:"],
        list: [
          "Access: You can request a copy of your personal data",
          "Correction: You can update or correct inaccurate information",
          "Deletion: You can request deletion of your personal data",
          "Opt-out: You can unsubscribe from marketing communications",
          "Portability: You can request your data in a portable format",
          "Restriction: You can request restriction of data processing",
        ],
      },
      {
        heading: "6. Cookies and Tracking",
        content: [
          "We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors are coming from.",
          "You can control cookie settings through your browser preferences. However, disabling cookies may affect the functionality of our website.",
        ],
      },
      {
        heading: "7. Third-Party Links",
        content: [
          "Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites.",
          "We encourage you to read the privacy policies of any third-party sites you visit through our platform.",
        ],
      },
      {
        heading: "8. Changes to Privacy Policy",
        content: [
          'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.',
          "Your continued use of our services after any changes indicates your acceptance of the updated Privacy Policy.",
        ],
      },
    ],
  },
  "shipping-policy": {
    id: "shipping-policy",
    href: PATH.SITE.LEGAL.SHIPPING,
    title: "Shipping & Delivery Policy",
    icon: <Truck className="h-6 w-6" />,
    lastUpdated: "October 15, 2024",
    description:
      "This Shipping & Delivery Policy outlines our practices for shipping and delivering products to our customers.",
    tableOfContents: [
      "Shipping Options",
      "Delivery Timeline",
      "Shipping Costs",
      "International Shipping",
      "Order Tracking",
      "Delivery Issues",
    ],
    sections: [
      {
        heading: "1. Shipping Options",
        content: ["We offer multiple shipping options to meet your delivery needs:"],
        list: [
          "Standard Shipping: 5-7 business days",
          "Express Shipping: 2-3 business days",
          "Next Day Delivery: Available in select areas",
          "International Shipping: 10-15 business days",
        ],
      },
      {
        heading: "2. Delivery Timeline",
        content: [
          "Orders are typically processed within 1-2 business days. Delivery timelines begin after your order has been shipped from our warehouse.",
          "Please note that delivery times are estimates and may vary based on your location, shipping method, and external factors such as weather or carrier delays.",
        ],
      },
      {
        heading: "3. Shipping Costs",
        content: [
          "Shipping costs are calculated based on the weight of your order, delivery location, and selected shipping method. Free shipping is available on orders over $50 within the continental United States.",
          "The exact shipping cost will be displayed at checkout before you complete your purchase.",
        ],
      },
      {
        heading: "4. International Shipping",
        content: [
          "We ship to most countries worldwide. International customers are responsible for any customs duties, taxes, or fees imposed by their country.",
          "Delivery times for international orders may vary and are subject to customs clearance procedures.",
        ],
      },
      {
        heading: "5. Order Tracking",
        content: [
          "Once your order ships, you will receive a confirmation email with tracking information. You can track your package through our website or directly on the carrier's website.",
          "Tracking information typically updates within 24 hours of shipment.",
        ],
      },
      {
        heading: "6. Delivery Issues",
        content: [
          "If your package is lost, delayed, or damaged during shipping, please contact our customer service team immediately. We will work with the carrier to resolve the issue and ensure you receive your order.",
          "For packages marked as delivered but not received, please check with neighbors or building management before contacting us.",
        ],
      },
    ],
  },
  "refund-policy": {
    id: "refund-policy",
    href: PATH.SITE.LEGAL.REFUND,
    title: "Refund & Cancellation Policy",
    icon: <Undo className="h-6 w-6" />,
    lastUpdated: "October 15, 2024",
    description:
      "This Refund & Cancellation Policy outlines our practices for processing refunds and cancellations of orders.",
    tableOfContents: [
      "Order Cancellation",
      "Refund Eligibility",
      "Refund Process",
      "Refund Timeline",
      "Non-Refundable Items",
      "Partial Refunds",
    ],
    sections: [
      {
        heading: "1. Order Cancellation",
        content: [
          "You may cancel your order within 24 hours of placement for a full refund. To cancel an order, please contact our customer service team immediately.",
          "Once an order has been shipped, it cannot be cancelled. However, you may return the item according to our Return Policy.",
        ],
      },
      {
        heading: "2. Refund Eligibility",
        content: ["To be eligible for a refund, items must meet the following criteria:"],
        list: [
          "Returned within 30 days of delivery",
          "In original condition with tags attached",
          "Unused and unworn",
          "In original packaging",
          "Include proof of purchase",
        ],
      },
      {
        heading: "3. Refund Process",
        content: [
          "To initiate a refund, please contact our customer service team with your order number and reason for return. We will provide you with return instructions and a prepaid shipping label if applicable.",
          "Once we receive and inspect your returned item, we will process your refund within 5-7 business days.",
        ],
      },
      {
        heading: "4. Refund Timeline",
        content: [
          "Refunds are processed to the original payment method within 5-7 business days after we receive and inspect your return.",
          "Depending on your financial institution, it may take an additional 3-5 business days for the refund to appear in your account.",
        ],
      },
      {
        heading: "5. Non-Refundable Items",
        content: ["Certain items cannot be returned or refunded:"],
        list: [
          "Final sale or clearance items",
          "Personalized or custom-made products",
          "Intimate apparel and swimwear",
          "Beauty and personal care items that have been opened",
          "Digital products and gift cards",
        ],
      },
      {
        heading: "6. Partial Refunds",
        content: [
          "In some cases, partial refunds may be granted for items that are returned but do not meet all return criteria.",
          "This includes items with obvious signs of use, items without original packaging, or items returned after the 30-day window.",
        ],
      },
    ],
  },
  "return-policy": {
    id: "return-policy",
    href: PATH.SITE.LEGAL.RETURN,
    title: "Return Policy",
    icon: <ShoppingBag className="h-6 w-6" />,
    lastUpdated: "October 15, 2024",
    description: "This Return Policy outlines our practices for processing returns and exchanges of orders.",
    tableOfContents: [
      "Return Window",
      "Return Process",
      "Return Shipping",
      "Exchanges",
      "Damaged or Defective Items",
      "Return Status",
    ],
    sections: [
      {
        heading: "1. Return Window",
        content: [
          "We accept returns within 30 days of delivery. Items must be in their original condition with all tags attached and in original packaging.",
          "The 30-day return window begins from the date of delivery, not the date of purchase.",
        ],
      },
      {
        heading: "2. Return Process",
        content: ["To initiate a return, follow these simple steps:"],
        list: [
          "Contact our customer service team with your order number",
          "Provide the reason for your return",
          "Receive return authorization and instructions",
          "Pack the item securely in its original packaging",
          "Attach the prepaid return label",
          "Drop off at any authorized carrier location",
        ],
      },
      {
        heading: "3. Return Shipping",
        content: [
          "For eligible returns, we provide prepaid return shipping labels. The return shipping cost will be deducted from your refund unless the return is due to our error or a defective product.",
          "You are responsible for ensuring the item is packaged securely to prevent damage during return shipping.",
        ],
      },
      {
        heading: "4. Exchanges",
        content: [
          "We currently do not offer direct exchanges. If you need a different size, color, or item, please return the original item for a refund and place a new order.",
          "This ensures you receive your preferred item as quickly as possible.",
        ],
      },
      {
        heading: "5. Damaged or Defective Items",
        content: [
          "If you receive a damaged or defective item, please contact us immediately with photos of the damage. We will arrange for a replacement or full refund at no cost to you.",
          "Damaged or defective returns are given priority processing and do not incur return shipping charges.",
        ],
      },
      {
        heading: "6. Return Status",
        content: [
          "You can track the status of your return through your account dashboard. Once we receive your return, you will be notified via email.",
          "Refunds are typically processed within 5-7 business days of receiving your return.",
        ],
      },
    ],
  },
  "user-agreement": {
    id: "user-agreement",
    href: PATH.SITE.LEGAL.USER_AGREEMENT,
    title: "User Agreement",
    icon: <User className="h-6 w-6" />,
    lastUpdated: "October 15, 2024",
    description:
      "This User Agreement outlines the terms and conditions for using our e-commerce platform. By accessing or using our website, you agree to be bound by these terms.",
    tableOfContents: [
      "User Conduct",
      "Account Responsibilities",
      "Content Guidelines",
      "Reviews and Feedback",
      "Termination Rights",
      "Dispute Resolution",
    ],
    sections: [
      {
        heading: "1. User Conduct",
        content: [
          "All users must conduct themselves in a respectful and lawful manner when using our platform. This includes interactions with other users, customer service representatives, and our community.",
          "Harassment, hate speech, threats, or any form of abusive behavior will not be tolerated and may result in immediate account suspension.",
        ],
      },
      {
        heading: "2. Account Responsibilities",
        content: ["You are solely responsible for all activities that occur under your account. This includes:"],
        list: [
          "Maintaining the confidentiality of your login credentials",
          "Ensuring the accuracy of your account information",
          "All purchases and transactions made through your account",
          "Notifying us immediately of any unauthorized access",
          "Complying with all applicable laws and regulations",
        ],
      },
      {
        heading: "3. Content Guidelines",
        content: [
          "Any content you submit to our platform, including reviews, comments, and images, must comply with our content guidelines. You retain ownership of your content but grant us a license to use it for promotional purposes.",
          "Prohibited content includes anything that is defamatory, obscene, fraudulent, or infringes on intellectual property rights.",
        ],
      },
      {
        heading: "4. Reviews and Feedback",
        content: [
          "We encourage honest reviews and feedback about our products. However, all reviews must be based on genuine experiences and comply with our content guidelines.",
          "Incentivized reviews must be disclosed, and fake or misleading reviews will be removed. Users who repeatedly violate review guidelines may lose review privileges.",
        ],
      },
      {
        heading: "5. Termination Rights",
        content: [
          "We reserve the right to suspend or terminate your account at any time for violation of this User Agreement or our other policies.",
          "You may also close your account at any time by contacting customer service. Upon termination, you will lose access to your account and any associated benefits.",
        ],
      },
      {
        heading: "6. Dispute Resolution",
        content: [
          "In the event of any dispute arising from your use of our platform, we encourage you to first contact our customer service team to seek an amicable resolution.",
          "If we are unable to resolve the dispute informally, you agree to binding arbitration in accordance with the laws of our jurisdiction.",
        ],
      },
    ],
  },
  "data-protection": {
    id: "data-protection",
    href: PATH.SITE.LEGAL.DATA_PROTECTION,
    title: "Data Protection & Security",
    icon: <Shield className="h-6 w-6" />,
    lastUpdated: "October 15, 2024",
    description:
      "This Data Protection & Security Policy outlines our commitment to protecting your personal data and ensuring the security of your information.",
    tableOfContents: [
      "Data Protection Principles",
      "Security Measures",
      "Data Encryption",
      "Breach Notification",
      "Data Retention",
      "Compliance Standards",
    ],
    sections: [
      {
        heading: "1. Data Protection Principles",
        content: [
          "We are committed to protecting your personal data in accordance with international data protection laws including GDPR and CCPA.",
          "Our data protection principles ensure that your information is processed lawfully, fairly, transparently, and only for specified purposes.",
        ],
      },
      {
        heading: "2. Security Measures",
        content: ["We implement comprehensive security measures to protect your data:"],
        list: [
          "Secure Socket Layer (SSL) encryption for all data transmission",
          "Regular security audits and vulnerability assessments",
          "Access controls and authentication protocols",
          "Employee training on data security best practices",
          "Secure data centers with physical security measures",
          "Regular backups and disaster recovery procedures",
        ],
      },
      {
        heading: "3. Data Encryption",
        content: [
          "All sensitive data, including payment information and passwords, is encrypted using industry-standard encryption algorithms both in transit and at rest.",
          "We use 256-bit SSL encryption for all transactions and data transfers, ensuring your information remains secure.",
        ],
      },
      {
        heading: "4. Breach Notification",
        content: [
          "In the unlikely event of a data breach that may affect your personal information, we will notify you within 72 hours as required by law.",
          "We maintain an incident response plan and work with cybersecurity experts to minimize the impact of any security incidents.",
        ],
      },
      {
        heading: "5. Data Retention",
        content: [
          "We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected and to comply with legal obligations.",
          "When data is no longer needed, it is securely deleted or anonymized. You can request deletion of your data at any time, subject to legal retention requirements.",
        ],
      },
      {
        heading: "6. Compliance Standards",
        content: ["Our data protection practices comply with major international standards:"],
        list: [
          "General Data Protection Regulation (GDPR)",
          "California Consumer Privacy Act (CCPA)",
          "Payment Card Industry Data Security Standard (PCI DSS)",
          "ISO 27001 Information Security Management",
          "SOC 2 Type II compliance",
        ],
      },
    ],
  },
  "cookies-policy": {
    id: "cookies-policy",
    href: PATH.SITE.LEGAL.COOKIES,
    title: "Cookie Policy",
    icon: <Mail className="h-6 w-6" />,
    lastUpdated: "October 15, 2024",
    description:
      "This Cookie Policy explains which cookies we use, why we use them, and how you can control your consent choices on our store.",
    tableOfContents: [
      "What Cookies Are",
      "Cookie Categories",
      "How We Use Consent",
      "Changing Your Preferences",
      "Consent Retention",
      "Contact",
    ],
    sections: [
      {
        heading: "1. What Cookies Are",
        content: [
          "Cookies are small text files stored on your device that help our website remember useful information between visits.",
          "We use cookies to keep essential shopping features working, understand store usage when you allow analytics, and prepare for future marketing integrations when you explicitly consent.",
        ],
        list: [
          "Authentication and security cookies",
          "Cart and checkout continuity cookies",
          "Optional analytics cookies",
          "Optional marketing cookies",
        ],
      },
      {
        heading: "2. Cookie Categories",
        content: [
          "We group cookies into clear categories so you can choose the optional uses that feel right for you.",
        ],
        list: [
          "Essential: always active for sign-in, cart, checkout, and security",
          "Functional: optional enhancements tied to this device",
          "Analytics: optional usage measurement and performance insights",
          "Marketing: optional advertising and retargeting support",
        ],
      },
      {
        heading: "3. How We Use Consent",
        content: [
          "Optional cookies are disabled by default until you make a choice in our cookie banner or from your account privacy settings.",
          "Essential cookies remain active because the store cannot function correctly without them.",
        ],
        list: [
          "Accept all to enable all optional categories",
          "Reject all except essential to keep only mandatory cookies active",
          "Customize to choose categories one by one",
        ],
      },
      {
        heading: "4. Changing Your Preferences",
        content: [
          "You can update your cookie choices at any time from the cookie banner when consent is missing or expired, and from your account privacy settings after signing in.",
          "When you withdraw optional consent, we stop future optional tracking and keep only essential cookies active.",
        ],
      },
      {
        heading: "5. Consent Retention",
        content: [
          "We remember your cookie choice for 6 months before asking again so your privacy preference stays current.",
        ],
        list: [
          "Consent choices are stored in your browser",
          "If you are signed in, we also save them to your account so they can be applied across devices",
          "We maintain consent history for compliance and audit purposes",
        ],
      },
      {
        heading: "6. Contact",
        content: [
          "If you have questions about cookies or privacy choices, please contact our support team.",
          "For broader details about personal data handling, please also review our Privacy Policy and Data Protection pages.",
        ],
      },
    ],
  },
};
