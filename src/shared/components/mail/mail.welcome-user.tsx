import { Html, Head, Body, Preview, Container, Text, Section } from '@react-email/components'

interface WelcomeEmailProps {
  name: string
}

export const WelcomeEmail = ({ name }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to Our App!</Preview>
    <Body style={bodyStyle}>
      <Container style={containerStyle}>
        <Section>
          <Text style={headingStyle}>Welcome to Our App!</Text>
          <Text>Hello {name},</Text>
          <Text>
            Thank you for signing up for our app! We’re thrilled to have you on board. Explore, build, and make
            something amazing.
          </Text>
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
