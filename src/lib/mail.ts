import { Resend } from 'resend'

import { env } from '@/env'

interface SendMailProps {
  from: string
  to: string[]
  subject: string
  html: string
}

const resend = new Resend(env.RESEND_KEY)

async function send(data: SendMailProps) {
  await resend.emails.send(data)
}

export const mail = {
  send,
}
