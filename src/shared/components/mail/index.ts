// Email Templates

// Email Styles and Content
export { emailContent, emailStyles } from "./email.styles";
export { DeleteAccountEmail } from "./mail.email-delete-account";
export { ResetPasswordEmail } from "./mail.email-reset-password";
export { VerifyEmail } from "./mail.email-verification";
// Types
export type { EmailPropsType, OrderConfirmationProps } from "./mail.methods";

// Email Methods
export {
  sendDeleteAccountEmail,
  sendEmailVerificationEmail,
  sendOrderConfirmationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
} from "./mail.methods";
export { OrderConfirmationEmail } from "./mail.order-confirmation";
export { WelcomeEmail } from "./mail.welcome-user";
