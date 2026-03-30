import { isEmailConfigured, transporter, getDefaultFromAddress } from './config';
import {
  orderConfirmationTemplate,
  invoiceTemplate,
  receiptTemplate,
  bookingReceivedTemplate,
  bookingApprovedTemplate,
  bookingReminderTemplate,
} from './templates';

type MailOptions = {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
};

function resolveAdminMail() {
  return process.env.ADMIN_EMAIL || process.env.SMTP_USER || '';
}

async function trySendMail(mailOptions: MailOptions) {
  if (!isEmailConfigured) {
    console.warn('Email skipped: SMTP is not configured.');
    return false;
  }

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email send failed:', error);
    return false;
  }
}

export async function sendOrderConfirmation(order: any) {
  const html = orderConfirmationTemplate(order);

  await trySendMail({
    from: getDefaultFromAddress(),
    to: order.customerEmail,
    bcc: resolveAdminMail() || undefined,
    subject: `Order Confirmation #${order.orderNumber} - Nicki Beauty Salon`,
    html,
  });
}

export async function sendInvoice(order: any) {
  const html = invoiceTemplate(order);

  await trySendMail({
    from: getDefaultFromAddress(),
    to: order.customerEmail,
    bcc: resolveAdminMail() || undefined,
    subject: `Invoice #${order.orderNumber} - Payment Required`,
    html,
  });
}

export async function sendReceipt(order: any, payment: any) {
  const html = receiptTemplate(order, payment);

  await trySendMail({
    from: getDefaultFromAddress(),
    to: order.customerEmail,
    bcc: resolveAdminMail() || undefined,
    subject: `Payment Receipt #${order.orderNumber} - Thank You!`,
    html,
  });
}

export async function sendBookingReceived(booking: any) {
  const html = bookingReceivedTemplate(booking);

  await trySendMail({
    from: getDefaultFromAddress(),
    to: booking.customerEmail,
    bcc: resolveAdminMail() || undefined,
    subject: `Booking Received - ${booking.service} on ${new Date(booking.date).toLocaleDateString()}`,
    html,
  });
}

export async function sendBookingApproved(booking: any) {
  const html = bookingApprovedTemplate(booking);

  await trySendMail({
    from: getDefaultFromAddress(),
    to: booking.customerEmail,
    bcc: resolveAdminMail() || undefined,
    subject: `Booking Approved - ${booking.service} on ${new Date(booking.date).toLocaleDateString()}`,
    html,
  });
}

export async function sendBookingConfirmation(booking: any) {
  return sendBookingApproved(booking);
}

export async function sendBookingReminder(booking: any) {
  const html = bookingReminderTemplate(booking);

  await trySendMail({
    from: getDefaultFromAddress(),
    to: booking.customerEmail,
    bcc: resolveAdminMail() || undefined,
    subject: `Reminder: Your Appointment Tomorrow at ${booking.time}`,
    html,
  });
}

export async function sendBookingAdminNotification(booking: any) {
  const adminEmail = resolveAdminMail();
  if (!adminEmail) {
    return false;
  }

  const bookedDate = new Date(booking.date).toLocaleDateString();
  const bookedTime = booking.time || 'N/A';

  const html = `
    <h2>New Booking Request</h2>
    <p><strong>Name:</strong> ${booking.customerName}</p>
    <p><strong>Email:</strong> ${booking.customerEmail || booking.email}</p>
    <p><strong>Phone:</strong> ${booking.phone || 'N/A'}</p>
    <p><strong>Service:</strong> ${booking.service}</p>
    <p><strong>Date:</strong> ${bookedDate}</p>
    <p><strong>Time:</strong> ${bookedTime}</p>
    <p><strong>Notes:</strong> ${booking.notes || 'None'}</p>
  `;

  return trySendMail({
    from: getDefaultFromAddress(),
    to: adminEmail,
    subject: `New Booking: ${booking.customerName} - ${booking.service}`,
    html,
  });
}

export async function sendPaymentAdminNotification(order: any, payment: any) {
  const adminEmail = resolveAdminMail();
  if (!adminEmail) {
    return false;
  }

  const html = `
    <h2>Payment Received</h2>
    <p><strong>Customer:</strong> ${order.customerName}</p>
    <p><strong>Email:</strong> ${order.customerEmail || order.email}</p>
    <p><strong>Order Ref:</strong> ${order.orderNumber}</p>
    <p><strong>Amount:</strong> ${payment.amount}</p>
    <p><strong>Status:</strong> ${payment.status}</p>
    <p><strong>Reference:</strong> ${payment.reference || payment.transactionId}</p>
  `;

  return trySendMail({
    from: getDefaultFromAddress(),
    to: adminEmail,
    subject: `Payment Received: ${order.orderNumber}`,
    html,
  });
}
