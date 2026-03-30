import { transporter, companyInfo, getDefaultFromAddress } from './config';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
}

export async function sendEmail({ to, subject, html, from, cc, bcc, replyTo }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: from || getDefaultFromAddress(),
      to,
      subject,
      html,
      cc,
      bcc,
      replyTo,
    });

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send failed:', error);
    return { success: false, error };
  }
}
