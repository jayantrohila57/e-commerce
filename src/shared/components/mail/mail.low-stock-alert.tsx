import { Body, Button, Container, Head, Html, Link, Preview, Section, Text } from "@react-email/components";
import { siteConfig } from "@/shared/config/site";
import { emailContent, emailStyles } from "./email.styles";

interface LowStockAlertProps {
  productName: string;
  variantTitle?: string;
  sku?: string;
  currentStock: number;
  threshold: number;
  dashboardUrl: string;
}

export const LowStockAlertEmail = ({
  productName,
  variantTitle,
  sku,
  currentStock,
  threshold,
  dashboardUrl,
}: LowStockAlertProps) => (
  <Html>
    <Head />
    <Preview>Low stock alert: {productName}</Preview>
    <Body style={emailStyles.body}>
      <Container style={emailStyles.container}>
        <Section>
          <Text style={emailStyles.heading}>Low stock alert</Text>
          <Text style={emailStyles.text}>
            The following product is running low on inventory and may need to be restocked.
          </Text>
          <Text style={emailStyles.text}>
            <strong>Product:</strong> {productName}
          </Text>
          {variantTitle && (
            <Text style={emailStyles.text}>
              <strong>Variant:</strong> {variantTitle}
            </Text>
          )}
          {sku && (
            <Text style={emailStyles.text}>
              <strong>SKU:</strong> {sku}
            </Text>
          )}
          <Text style={emailStyles.text}>
            <strong>Current stock:</strong> {currentStock} units
          </Text>
          <Text style={emailStyles.text}>
            <strong>Threshold:</strong> {threshold} units
          </Text>
        </Section>
        <Section>
          <Button href={dashboardUrl} style={emailStyles.warningButton}>
            View inventory
          </Button>
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
