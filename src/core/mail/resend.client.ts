import { Resend } from 'resend'
import { env } from '@/shared/config/env'

const mail = new Resend(env.RESEND_API_KEY)

export default mail

export function sendEmail({ to, subject, html, text }: { to: string; subject: string; html: string; text: string }) {
  return mail.emails.send({
    from: env.RESEND_FROM_EMAIL!,
    to,
    subject,
    html,
    text
  })
}
