import { transporter } from './config';
import { 
  orderConfirmationTemplate, 
  invoiceTemplate, 
  receiptTemplate,
  bookingConfirmationTemplate,
  bookingReminderTemplate 
} from './templates';

export async function sendOrderConfirmation(order: any) {
  const html = orderConfirmationTemplate(order);
  
  await transporter.sendMail({
    from: '"Nicki Beauty Salon" <info@nickibeauty.com>',
    to: order.customerEmail,
    subject: `Order Confirmation #${order.orderNumber} - Nicki Beauty Salon`,
    html,
  });
}

export async function sendInvoice(order: any) {
  const html = invoiceTemplate(order);
  
  await transporter.sendMail({
    from: '"Nicki Beauty Salon" <info@nickibeauty.com>',
    to: order.customerEmail,
    subject: `Invoice #${order.orderNumber} - Payment Required`,
    html,
  });
}

export async function sendReceipt(order: any, payment: any) {
  const html = receiptTemplate(order, payment);
  
  await transporter.sendMail({
    from: '"Nicki Beauty Salon" <info@nickibeauty.com>',
    to: order.customerEmail,
    subject: `Payment Receipt #${order.orderNumber} - Thank You!`,
    html,
  });
}

export async function sendBookingConfirmation(booking: any) {
  const html = bookingConfirmationTemplate(booking);
  
  await transporter.sendMail({
    from: '"Nicki Beauty Salon" <info@nickibeauty.com>',
    to: booking.customerEmail,
    subject: `Booking Confirmed - ${booking.service} on ${new Date(booking.date).toLocaleDateString()}`,
    html,
  });
}

export async function sendBookingReminder(booking: any) {
  const html = bookingReminderTemplate(booking);
  
  await transporter.sendMail({
    from: '"Nicki Beauty Salon" <info@nickibeauty.com>',
    to: booking.customerEmail,
    subject: `Reminder: Your Appointment Tomorrow at ${booking.time}`,
    html,
  });
}
