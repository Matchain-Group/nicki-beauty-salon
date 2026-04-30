import nodemailer from 'nodemailer';

// Email configuration
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'your-email@gmail.com',
    pass: process.env.SMTP_PASS || 'your-app-password',
  },
});

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
