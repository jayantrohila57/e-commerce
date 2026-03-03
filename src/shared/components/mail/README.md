# Email System

This directory contains the complete email system for ShopHub, including templates, styles, and sending methods.

## Configuration

Email configuration is managed through `site.ts`:

- **Brand Identity**: Company name, colors, and styling
- **Contact Information**: Email addresses, phone, and address
- **Email Settings**: From addresses, footer content, legal links
- **URLs**: Website URLs for various pages

## Available Templates

### 1. Welcome Email (`WelcomeEmail`)
- **Usage**: User registration
- **Method**: `sendWelcomeEmail({ user })`
- **Content**: Welcome message and brand introduction

### 2. Email Verification (`VerifyEmail`)
- **Usage**: Email address verification
- **Method**: `sendEmailVerificationEmail({ user, url })`
- **Content**: Verification link with security notice

### 3. Password Reset (`ResetPasswordEmail`)
- **Usage**: Password reset requests
- **Method**: `sendPasswordResetEmail({ user, url })`
- **Content**: Password reset link with security notice

### 4. Delete Account (`DeleteAccountEmail`)
- **Usage**: Account deletion confirmation
- **Method**: `sendDeleteAccountEmail({ user, url })`
- **Content**: Deletion confirmation link with security notice

### 5. Order Confirmation (`OrderConfirmationEmail`)
- **Usage**: Order completion
- **Method**: `sendOrderConfirmationEmail({ user, orderNumber, items, total, shippingAddress, orderUrl })`
- **Content**: Order details, items, shipping info, and tracking link

## Usage Examples

```typescript
import { 
  sendWelcomeEmail, 
  sendOrderConfirmationEmail,
  type EmailPropsType 
} from "@/shared/components/mail";

// Send welcome email
await sendWelcomeEmail({
  user: { name: "John Doe", email: "john@example.com" }
});

// Send order confirmation
await sendOrderConfirmationEmail({
  user: { name: "John Doe", email: "john@example.com" },
  orderNumber: "ORD-12345",
  items: [
    { name: "Product A", quantity: 2, price: "$29.99" },
    { name: "Product B", quantity: 1, price: "$49.99" }
  ],
  total: "$109.97",
  shippingAddress: {
    line1: "123 Main St",
    city: "San Francisco",
    state: "CA",
    postalCode: "94105",
    country: "USA"
  },
  orderUrl: "https://shophub.com/account/orders/ORD-12345"
});
```

## Styling

All emails use consistent styling from `email.styles.ts`:

- **Brand Colors**: Defined in site configuration
- **Typography**: System fonts for optimal rendering
- **Responsive**: Mobile-friendly design
- **Footer**: Company info, legal links, and support details

## Configuration

Update `site.ts` to customize:

- Company information and branding
- Email addresses and contact details
- Social media links
- Business hours and policies
- Brand colors and styling

## Environment Variables

Required environment variables:

```env
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

## Testing

To test emails in development:

1. Set up Resend account and API key
2. Configure environment variables
3. Use the email methods in your auth/order flows
4. Check email delivery and rendering

All templates include both HTML and plain text versions for maximum compatibility.
