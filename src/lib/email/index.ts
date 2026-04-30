import { transporter, companyInfo } from './config';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: from || `"${companyInfo.name}" <${companyInfo.email}>`,
      to,
      subject,
      html,
    });

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send failed:', error);
    return { success: false, error };
  }
}
