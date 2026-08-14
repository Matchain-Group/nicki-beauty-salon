import nodemailer from 'nodemailer';

// Email configuration (Brevo/Sendinblue SMTP relay).
// Falls back to localhost only when SMTP_USER is unset, so misconfiguration is
// surfaced loudly instead of silently switching providers.
const SMTP_HOST = process.env.SMTP_HOST || 'smtp-relay.brevo.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';

export const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465, // true for 465, false for 587
  auth: SMTP_USER
    ? { user: SMTP_USER, pass: SMTP_PASS }
    : undefined,
});

// Verify config at module load so mail failures are obvious, not silent.
if (!SMTP_USER) {
  console.error(
    '❌ SMTP_USER is not set — email receipts/invoices will not be sent. ' +
    'Configure SMTP_HOST/SMTP_USER/SMTP_PASS/SMTP_FROM in your environment.'
  );
}

// Company branding - USA Business Details
export const companyInfo = {
  name: 'Nicki Beauty Salon & Spa',
  address: '2847 Glamour Avenue, Beverly Hills, CA 90210, USA',
  phone: '+1 (310) 555-0192',
  email: 'hello@nickibeautyspa.com',
  website: 'https://nickibeautyspa.com',
  logo: 'https://nickibeautyspa.com/images/logo.png',
  hours: 'Mon-Sat: 9AM - 8PM | Sun: 10AM - 6PM',
  social: {
    instagram: '@nickibeautyspa',
    facebook: 'facebook.com/nickibeautyspa',
    twitter: '@nickibeautyspa',
  },
  colors: {
    primary: '#3d2314',
    gold: '#d4a574',
    cream: '#faf7f2',
  }
};
