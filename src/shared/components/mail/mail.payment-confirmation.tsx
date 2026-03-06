import { Body, Container, Head, Html, Link, Preview, Section, Text } from "@react-email/components";
import { siteConfig } from "@/shared/config/site";
import { emailContent, emailStyles } from "./email.styles";

interface PaymentConfirmationProps {
  name: string;
  orderNumber: string;
  amount: string;
  paymentMethod: string;
  transactionId?: string;
  paymentDate: string;
  orderUrl?: string;
}

export const PaymentConfirmationEmail = ({
  name,
  orderNumber,
  amount,
  paymentMethod,
  transactionId,
  paymentDate,
  orderUrl,
}: PaymentConfirmationProps) => (
  <Html>
    <Head />
    <Preview>Payment received for Order #{orderNumber}</Preview>
    <Body style={emailStyles.body}>
      <Container style={emailStyles.container}>
        <Section>
          <Text style={emailStyles.heading}>Payment received</Text>
          <Text style={emailStyles.text}>{emailContent.greeting(name)}</Text>
          <Text style={emailStyles.text}>
            We have received your payment for order <strong>#{orderNumber}</strong>.
          </Text>
          <Text style={emailStyles.text}>
            <strong>Amount:</strong> {amount}
          </Text>
          <Text style={emailStyles.text}>
            <strong>Payment method:</strong> {paymentMethod}
          </Text>
          <Text style={emailStyles.text}>
            <strong>Date:</strong> {paymentDate}
          </Text>
          {transactionId && (
            <Text style={emailStyles.mutedText}>
              <strong>Transaction ID:</strong> {transactionId}
            </Text>
          )}
        </Section>
        {orderUrl && (
          <Section>
            <Text style={emailStyles.text}>View your order details:</Text>
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
