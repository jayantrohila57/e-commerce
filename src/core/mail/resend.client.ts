import { Resend } from 'resend'
import { serverEnv } from '@/shared/config/env.server'

const mail = new Resend(serverEnv.RESEND_API_KEY)

export default mail

export function sendEmail({ to, subject, html, text }: { to: string; subject: string; html: string; text: string }) {
  return mail.emails.send({
    from: serverEnv.RESEND_FROM_EMAIL,
    to,
    subject,
    html,
    text,
  })
}
