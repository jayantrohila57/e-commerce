import { render } from '@react-email/render'
import { sendEmail } from '@/core/mail/resend.client'
import { VerifyEmail } from './mail.email-verification'

interface EmailVerificationData {
  user: { name: string; email: string }
  url: string
}

export async function sendEmailVerificationEmail({ user, url }: EmailVerificationData) {
  const html = await render(<VerifyEmail name={user.name} url={url} />)
  const text = await render(<VerifyEmail name={user.name} url={url} />, { plainText: true })

  await sendEmail({
    to: user.email,
    subject: 'Verify your email address',
    html,
    text
  })
}
