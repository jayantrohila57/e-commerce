import { Body, Button, Container, Head, Html, Link, Preview, Section, Text } from "@react-email/components";
import { siteConfig } from "@/shared/config/site";
import { emailContent, emailStyles } from "./email.styles";

interface OrderStatusProps {
  name: string;
  orderNumber: string;
  newStatus: string;
  orderUrl?: string;
}

const STATUS_MESSAGES: Record<string, string> = {
  paid: "Your payment has been confirmed and we're preparing your order.",
  shipped: "Your order has been shipped and is on its way.",
  delivered: "Your order has been delivered. Thank you for shopping with us!",
  cancelled: "Your order has been cancelled.",
};

export const OrderStatusEmail = ({ name, orderNumber, newStatus, orderUrl }: OrderStatusProps) => {
  const message =
    STATUS_MESSAGES[newStatus] ?? `Your order status has been updated to ${newStatus.replace(/_/g, " ")}.`;

  return (
    <Html>
      <Head />
      <Preview>Order #{orderNumber} status update</Preview>
      <Body style={emailStyles.body}>
        <Container style={emailStyles.container}>
          <Section>
            <Text style={emailStyles.heading}>Order status update</Text>
            <Text style={emailStyles.text}>{emailContent.greeting(name)}</Text>
            <Text style={emailStyles.text}>
              Your order <strong>#{orderNumber}</strong> has been updated.
            </Text>
            <Text style={emailStyles.text}>{message}</Text>
          </Section>
          {orderUrl && (
            <Section>
              <Link href={orderUrl} style={emailStyles.button}>
                View order
              </Link>
            </Section>
          )}
          <Section>
            <Text style={emailStyles.text}>{emailContent.signOff()}</Text>
          </Section>
          <Section style={emailStyles.footer}>
            <Text style={emailStyles.mutedText}>{siteConfig.email.footer.company}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
