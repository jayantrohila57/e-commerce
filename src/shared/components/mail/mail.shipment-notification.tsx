import { Body, Button, Container, Head, Html, Link, Preview, Section, Text } from "@react-email/components";
import { siteConfig } from "@/shared/config/site";
import { emailContent, emailStyles } from "./email.styles";

interface ShipmentNotificationProps {
  name: string;
  orderNumber: string;
  trackingNumber: string;
  carrier?: string;
  status: string;
  estimatedDelivery?: string;
  trackingUrl?: string;
  orderUrl?: string;
}

export const ShipmentNotificationEmail = ({
  name,
  orderNumber,
  trackingNumber,
  carrier,
  status,
  estimatedDelivery,
  trackingUrl,
  orderUrl,
}: ShipmentNotificationProps) => (
  <Html>
    <Head />
    <Preview>Your order #{orderNumber} has been shipped</Preview>
    <Body style={emailStyles.body}>
      <Container style={emailStyles.container}>
        <Section>
          <Text style={emailStyles.heading}>Your order is on the way</Text>
          <Text style={emailStyles.text}>{emailContent.greeting(name)}</Text>
          <Text style={emailStyles.text}>
            Your order <strong>#{orderNumber}</strong> has been shipped.
          </Text>
          <Text style={emailStyles.text}>
            <strong>Tracking number:</strong> {trackingNumber}
          </Text>
          {carrier && (
            <Text style={emailStyles.text}>
              <strong>Carrier:</strong> {carrier}
            </Text>
          )}
          <Text style={emailStyles.text}>
            <strong>Status:</strong> {status.replace(/_/g, " ")}
          </Text>
          {estimatedDelivery && (
            <Text style={emailStyles.text}>
              <strong>Estimated delivery:</strong> {estimatedDelivery}
            </Text>
          )}
        </Section>
        <Section>
          {(trackingUrl || orderUrl) && (
            <>
              {trackingUrl && (
                <Button href={trackingUrl} style={emailStyles.successButton}>
                  Track package
                </Button>
              )}
              {orderUrl && (
                <Link href={orderUrl} style={emailStyles.button}>
                  View order
                </Link>
              )}
            </>
          )}
        </Section>
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
