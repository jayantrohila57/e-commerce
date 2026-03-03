import { Body, Container, Head, Hr, Html, Link, Preview, Section, Text } from "@react-email/components";
import { siteConfig } from "@/shared/config/site";
import { emailContent, emailStyles } from "./email.styles";

interface OrderItem {
  name: string;
  quantity: number;
  price: string;
  variant?: string;
}

interface OrderConfirmationProps {
  name: string;
  orderNumber: string;
  items: OrderItem[];
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

export const OrderConfirmationEmail = ({
  name,
  orderNumber,
  items,
  total,
  shippingAddress,
  orderUrl,
}: OrderConfirmationProps) => (
  <Html>
    <Head />
    <Preview>Order Confirmation #{orderNumber}</Preview>
    <Body style={emailStyles.body}>
      <Container style={emailStyles.container}>
        <Section>
          <Text style={emailStyles.heading}>Order Confirmed!</Text>
          <Text style={emailStyles.text}>{emailContent.greeting(name)}</Text>
          <Text style={emailStyles.text}>
            Thank you for your order! We're excited to get your items shipped to you.
          </Text>
          <Text style={emailStyles.text}>
            <strong>Order Number:</strong> #{orderNumber}
          </Text>
        </Section>

        <Section>
          <Text style={emailStyles.heading}>Order Details</Text>
          {items.map((item, index) => (
            <div key={index} style={{ marginBottom: "16px" }}>
              <Text style={emailStyles.text}>
                <strong>{item.name}</strong>
                {item.variant && ` (${item.variant})`}
              </Text>
              <Text style={emailStyles.mutedText}>
                Quantity: {item.quantity} × {item.price}
              </Text>
            </div>
          ))}
          <Hr style={{ border: "1px solid #e5e7eb", margin: "24px 0" }} />
          <Text style={emailStyles.text}>
            <strong>Total: {total}</strong>
          </Text>
        </Section>

        <Section>
          <Text style={emailStyles.heading}>Shipping Address</Text>
          <Text style={emailStyles.text}>
            {shippingAddress.line1}
            {shippingAddress.line2 && (
              <>
                <br />
                {shippingAddress.line2}
              </>
            )}
            <br />
            {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
            <br />
            {shippingAddress.country}
          </Text>
        </Section>

        {orderUrl && (
          <Section>
            <Text style={emailStyles.text}>You can track your order status and view details here:</Text>
            <Link href={orderUrl} style={emailStyles.button}>
              View Order Details
            </Link>
          </Section>
        )}

        <Section>
          <Text style={emailStyles.text}>{emailContent.signOff()}</Text>
        </Section>

        <Section style={emailStyles.footer}>
          <Text style={emailStyles.mutedText}>{siteConfig.email.footer.company}</Text>
          <Text style={emailStyles.mutedText}>
            {siteConfig.contact.address.line1}, {siteConfig.contact.address.city}, {siteConfig.contact.address.state}{" "}
            {siteConfig.contact.address.postalCode}
          </Text>
          <Text style={emailStyles.mutedText}>
            <Link href={siteConfig.urls.privacy} style={emailStyles.footerLink}>
              {siteConfig.email.footer.privacy}
            </Link>
            {" • "}
            <Link href={siteConfig.urls.terms} style={emailStyles.footerLink}>
              {siteConfig.email.footer.terms}
            </Link>
          </Text>
          <Text style={emailStyles.mutedText}>{emailContent.supportInfo()}</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);
