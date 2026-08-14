import { transporter } from './config';
import { 
  orderConfirmationTemplate, 
  invoiceTemplate, 
  receiptTemplate,
  bookingConfirmationTemplate,
  bookingReminderTemplate 
} from './templates';

const FROM = process.env.SMTP_FROM || 'info@nickibeauty.com';

function mail(opts: { to: string; subject: string; html: string }) {
  return transporter.sendMail({
    from: FROM,
    ...opts,
  });
}

export async function sendOrderConfirmation(order: any) {
  const html = orderConfirmationTemplate(order);
  await mail({
    to: order.customerEmail,
    subject: `Order Confirmation #${order.orderNumber} - Nicki Beauty Salon`,
    html,
  });
}

export async function sendInvoice(order: any) {
  const html = invoiceTemplate(order);
  await mail({
    to: order.customerEmail,
    subject: `Invoice #${order.orderNumber} - Payment Required`,
    html,
  });
}

export async function sendReceipt(order: any, payment: any) {
  const html = receiptTemplate(order, payment);
  await mail({
    to: order.customerEmail,
    subject: `Payment Receipt #${order.orderNumber} - Thank You!`,
    html,
  });
}

export async function sendBookingConfirmation(booking: any) {
  const html = bookingConfirmationTemplate(booking);

  await mail({
    to: booking.customerEmail,
    subject: `Booking Confirmed - ${booking.service} on ${new Date(booking.date).toLocaleDateString()}`,
    html,
  });
}

export async function sendBookingReminder(booking: any) {
  const html = bookingReminderTemplate(booking);

  await mail({
    to: booking.customerEmail,
    subject: `Reminder: Your Appointment Tomorrow at ${booking.time}`,
    html,
  });
}
