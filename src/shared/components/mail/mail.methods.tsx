import { render } from "@react-email/render";
import { sendEmail } from "@/core/mail/resend.client";
import { siteConfig } from "@/shared/config/site";
import { DeleteAccountEmail } from "./mail.email-delete-account";
import { ResetPasswordEmail } from "./mail.email-reset-password";
import { VerifyEmail } from "./mail.email-verification";
import { LowStockAlertEmail } from "./mail.low-stock-alert";
import { OrderConfirmationEmail } from "./mail.order-confirmation";
import { OrderStatusEmail } from "./mail.order-status";
import { PaymentConfirmationEmail } from "./mail.payment-confirmation";
import { ShipmentNotificationEmail } from "./mail.shipment-notification";
import { WelcomeEmail } from "./mail.welcome-user";

export interface EmailPropsType {
  user: { name: string; email: string };
  url?: string;
}

export interface OrderConfirmationProps {
  user: { name: string; email: string };
  orderNumber: string;
  items: Array<{
    name: string;
    quantity: number;
    price: string;
    variant?: string;
  }>;
  total: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  orderUrl?: string;
}

export async function sendEmailVerificationEmail({ user, url }: EmailPropsType) {
  const html = await render(<VerifyEmail name={user.name} url={url!} />);
  const text = await render(<VerifyEmail name={user.name} url={url!} />, {
    plainText: true,
  });

  await sendEmail({
    to: user.email,
    from: `${siteConfig.email.from.name} <${siteConfig.email.from.address}>`,
    subject: `Verify your ${siteConfig.name} email address`,
    html,
    text,
  });
}

export async function sendPasswordResetEmail({ user, url }: EmailPropsType) {
  const html = await render(<ResetPasswordEmail name={user.name} url={url!} />);
  const text = await render(<ResetPasswordEmail name={user.name} url={url!} />, {
    plainText: true,
  });

  await sendEmail({
    to: user.email,
    from: `${siteConfig.email.from.name} <${siteConfig.email.from.address}>`,
    subject: `Reset your ${siteConfig.name} password`,
    html,
    text,
  });
}

export async function sendWelcomeEmail({ user }: EmailPropsType) {
  const html = await render(<WelcomeEmail name={user.name} />);
  const text = await render(<WelcomeEmail name={user.name} />, {
    plainText: true,
  });

  await sendEmail({
    to: user.email,
    from: `${siteConfig.email.from.name} <${siteConfig.email.from.address}>`,
    subject: `Welcome to ${siteConfig.name}!`,
    html,
    text,
  });
}

export async function sendDeleteAccountEmail({ user, url }: EmailPropsType) {
  const html = await render(<DeleteAccountEmail name={user.name} url={url!} />);
  const text = await render(<DeleteAccountEmail name={user.name} url={url!} />, {
    plainText: true,
  });

  await sendEmail({
    to: user.email,
    from: `${siteConfig.email.from.name} <${siteConfig.email.from.address}>`,
    subject: `Confirm your ${siteConfig.name} account deletion`,
    html,
    text,
  });
}

export async function sendOrderConfirmationEmail({
  user,
  orderNumber,
  items,
  total,
  shippingAddress,
  orderUrl,
}: OrderConfirmationProps) {
  const html = await render(
    <OrderConfirmationEmail
      name={user.name}
      orderNumber={orderNumber}
      items={items}
      total={total}
      shippingAddress={shippingAddress}
      orderUrl={orderUrl}
    />,
  );
  const text = await render(
    <OrderConfirmationEmail
      name={user.name}
      orderNumber={orderNumber}
      items={items}
      total={total}
      shippingAddress={shippingAddress}
      orderUrl={orderUrl}
    />,
    { plainText: true },
  );

  await sendEmail({
    to: user.email,
    from: `${siteConfig.email.from.name} <${siteConfig.email.from.address}>`,
    subject: `Order Confirmation #${orderNumber}`,
    html,
    text,
  });
}

export interface PaymentConfirmationProps {
  user: { name: string; email: string };
  orderNumber: string;
  amount: string;
  paymentMethod: string;
  transactionId?: string;
  paymentDate: string;
  orderUrl?: string;
}

export async function sendPaymentConfirmationEmail({
  user,
  orderNumber,
  amount,
  paymentMethod,
  transactionId,
  paymentDate,
  orderUrl,
}: PaymentConfirmationProps) {
  const html = await render(
    <PaymentConfirmationEmail
      name={user.name}
      orderNumber={orderNumber}
      amount={amount}
      paymentMethod={paymentMethod}
      transactionId={transactionId}
      paymentDate={paymentDate}
      orderUrl={orderUrl}
    />,
  );
  const text = await render(
    <PaymentConfirmationEmail
      name={user.name}
      orderNumber={orderNumber}
      amount={amount}
      paymentMethod={paymentMethod}
      transactionId={transactionId}
      paymentDate={paymentDate}
      orderUrl={orderUrl}
    />,
    { plainText: true },
  );
  await sendEmail({
    to: user.email,
    from: `${siteConfig.email.from.name} <${siteConfig.email.from.address}>`,
    subject: `Payment received for Order #${orderNumber}`,
    html,
    text,
  });
}

export interface ShipmentNotificationProps {
  user: { name: string; email: string };
  orderNumber: string;
  trackingNumber: string;
  carrier?: string;
  status: string;
  estimatedDelivery?: string;
  trackingUrl?: string;
  orderUrl?: string;
}

export async function sendShipmentNotificationEmail({
  user,
  orderNumber,
  trackingNumber,
  carrier,
  status,
  estimatedDelivery,
  trackingUrl,
  orderUrl,
}: ShipmentNotificationProps) {
  const html = await render(
    <ShipmentNotificationEmail
      name={user.name}
      orderNumber={orderNumber}
      trackingNumber={trackingNumber}
      carrier={carrier}
      status={status}
      estimatedDelivery={estimatedDelivery}
      trackingUrl={trackingUrl}
      orderUrl={orderUrl}
    />,
  );
  const text = await render(
    <ShipmentNotificationEmail
      name={user.name}
      orderNumber={orderNumber}
      trackingNumber={trackingNumber}
      carrier={carrier}
      status={status}
      estimatedDelivery={estimatedDelivery}
      trackingUrl={trackingUrl}
      orderUrl={orderUrl}
    />,
    { plainText: true },
  );
  await sendEmail({
    to: user.email,
    from: `${siteConfig.email.from.name} <${siteConfig.email.from.address}>`,
    subject: `Your order #${orderNumber} has been shipped`,
    html,
    text,
  });
}

export interface OrderStatusProps {
  user: { name: string; email: string };
  orderNumber: string;
  newStatus: string;
  orderUrl?: string;
}

export async function sendOrderStatusEmail({ user, orderNumber, newStatus, orderUrl }: OrderStatusProps) {
  const html = await render(
    <OrderStatusEmail name={user.name} orderNumber={orderNumber} newStatus={newStatus} orderUrl={orderUrl} />,
  );
  const text = await render(
    <OrderStatusEmail name={user.name} orderNumber={orderNumber} newStatus={newStatus} orderUrl={orderUrl} />,
    { plainText: true },
  );
  await sendEmail({
    to: user.email,
    from: `${siteConfig.email.from.name} <${siteConfig.email.from.address}>`,
    subject: `Order #${orderNumber} status update`,
    html,
    text,
  });
}

export interface LowStockAlertProps {
  productName: string;
  variantTitle?: string;
  sku?: string;
  currentStock: number;
  threshold: number;
  dashboardUrl: string;
  toEmail: string;
}

export async function sendLowStockAlertEmail({
  productName,
  variantTitle,
  sku,
  currentStock,
  threshold,
  dashboardUrl,
  toEmail,
}: LowStockAlertProps) {
  const html = await render(
    <LowStockAlertEmail
      productName={productName}
      variantTitle={variantTitle}
      sku={sku}
      currentStock={currentStock}
      threshold={threshold}
      dashboardUrl={dashboardUrl}
    />,
  );
  const text = await render(
    <LowStockAlertEmail
      productName={productName}
      variantTitle={variantTitle}
      sku={sku}
      currentStock={currentStock}
      threshold={threshold}
      dashboardUrl={dashboardUrl}
    />,
    { plainText: true },
  );
  await sendEmail({
    to: toEmail,
    from: `${siteConfig.email.from.name} <${siteConfig.email.from.address}>`,
    subject: `Low stock alert: ${productName}`,
    html,
    text,
  });
}
