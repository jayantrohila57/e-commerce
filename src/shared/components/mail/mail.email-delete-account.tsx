import { Html, Head, Preview, Body, Container, Section, Text, Button } from '@react-email/components'

interface DeleteAccountEmailProps {
  name: string
  url: string
}

export const DeleteAccountEmail = ({ name, url }: DeleteAccountEmailProps) => (
  <Html>
    <Head />
    <Preview>Confirm your account deletion</Preview>
    <Body style={bodyStyle}>
      <Container style={containerStyle}>
        <Section>
          <Text style={headingStyle}>Confirm Account Deletion</Text>
          <Text>Hello {name},</Text>
          <Text>
            We&apos;re sorry to see you go! Please confirm your account deletion by clicking the button below:
          </Text>
          <Button
            href={url}
            style={buttonStyle}
          >
            Confirm Deletion
          </Button>
          <Text>If you don&apos;t have an account, please ignore this email.</Text>
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
  backgroundColor: '#dc3545',
  color: '#fff',
  padding: '12px 24px',
  borderRadius: '6px',
  textDecoration: 'none',
  display: 'inline-block',
  marginTop: '16px',
}
