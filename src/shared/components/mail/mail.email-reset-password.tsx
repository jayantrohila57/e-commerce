import { Html, Head, Preview, Body, Container, Section, Text, Button } from '@react-email/components'

interface ResetPasswordEmailProps {
  name: string
  url: string
}

export const ResetPasswordEmail = ({ name, url }: ResetPasswordEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset your password</Preview>
    <Body style={bodyStyle}>
      <Container style={containerStyle}>
        <Section>
          <Text style={headingStyle}>Reset Your Password</Text>
          <Text>Hello {name},</Text>
          <Text>You requested to reset your password. Click the button below to set a new one:</Text>
          <Button
            href={url}
            style={buttonStyle}
          >
            Reset Password
          </Button>
          <Text>If you didn’t request this, please ignore this email.</Text>
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
  fontFamily: 'Arial, sans-serif',
}

const containerStyle = {
  backgroundColor: '#ffffff',
  padding: '32px',
  borderRadius: '8px',
  maxWidth: '600px',
  margin: '0 auto',
}

const headingStyle = {
  color: '#333',
  fontSize: '22px',
  fontWeight: 'bold',
}

const buttonStyle = {
  backgroundColor: '#007bff',
  color: '#fff',
  padding: '12px 24px',
  borderRadius: '6px',
  textDecoration: 'none',
  display: 'inline-block',
  marginTop: '16px',
}
