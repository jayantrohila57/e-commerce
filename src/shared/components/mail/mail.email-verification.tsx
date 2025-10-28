import { Html, Head, Preview, Body, Container, Text, Button, Section } from '@react-email/components'

interface VerifyEmailProps {
  name: string
  url: string
}

export const VerifyEmail = ({ name, url }: VerifyEmailProps) => (
  <Html>
    <Head />
    <Preview>Verify your email address</Preview>
    <Body style={bodyStyle}>
      <Container style={containerStyle}>
        <Section>
          <Text style={headingStyle}>Verify Your Email</Text>
          <Text>Hello {name},</Text>
          <Text>Thank you for signing up! Please verify your email address by clicking the button below:</Text>
          <Button href={url} style={buttonStyle}>
            Verify Email
          </Button>
          <Text>If you didn’t create an account, please ignore this email.</Text>
          <Text>This link will expire in 24 hours.</Text>
          <Text>
            Best regards,
            <br />
            Your App Team
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

const bodyStyle = {
  backgroundColor: '#f9f9f9',
  fontFamily: 'Arial, sans-serif'
}
const containerStyle = {
  backgroundColor: '#ffffff',
  padding: '32px',
  borderRadius: '8px',
  maxWidth: '600px',
  margin: '0 auto'
}
const headingStyle = { color: '#333', fontSize: '22px', fontWeight: 'bold' }
const buttonStyle = {
  backgroundColor: '#28a745',
  color: '#fff',
  padding: '12px 24px',
  borderRadius: '6px',
  textDecoration: 'none',
  display: 'inline-block',
  marginTop: '16px'
}
