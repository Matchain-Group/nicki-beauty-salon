import nodemailer from 'nodemailer';

const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);

const hasPlaceholderConfig =
  SMTP_USER === 'your-email@gmail.com' ||
  SMTP_PASS === 'your-app-password' ||
  !SMTP_USER ||
  !SMTP_PASS;

// Email configuration
export const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export const isEmailConfigured = !hasPlaceholderConfig;

export function getDefaultFromAddress() {
  const fromEmail = process.env.SMTP_FROM || process.env.EMAIL_FROM || companyInfo.email;
  return `"${companyInfo.name}" <${fromEmail}>`;
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
