import { render } from '@react-email/render'
import { sendEmail } from '@/core/mail/resend.client'
import { VerifyEmail } from './mail.email-verification'
import { ResetPasswordEmail } from './mail.email-reset-password'
import { WelcomeEmail } from './mail.welcome-user'

interface EmailPropsType {
  user: { name: string; email: string }
  url: string
}

export async function sendEmailVerificationEmail({
  user,
  url
}: EmailPropsType) {
  const html = await render(<VerifyEmail name={user.name} url={url} />)
  const text = await render(<VerifyEmail name={user.name} url={url} />, {
    plainText: true
  })

  await sendEmail({
    to: user.email,
    subject: 'Verify your email address',
    html,
    text
  })
}

export async function sendPasswordResetEmail({ user, url }: EmailPropsType) {
  const html = await render(<ResetPasswordEmail name={user.name} url={url} />)
  const text = await render(<ResetPasswordEmail name={user.name} url={url} />, {
    plainText: true
  })

  await sendEmail({
    to: user.email,
    subject: 'Reset your password',
    html,
    text
  })
}

export async function sendWelcomeEmail({ user }: EmailPropsType) {
  const html = await render(<WelcomeEmail name={user.name} />);
  const text = await render(<WelcomeEmail name={user.name} />, {
    plainText: true
  });

  await sendEmail({
    to: user.email,
    subject: "Welcome to Our App!",
    html,
    text,
  });
}