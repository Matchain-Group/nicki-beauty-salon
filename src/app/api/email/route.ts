import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import {
  orderConfirmationTemplate,
  invoiceTemplate,
  receiptTemplate,
  bookingConfirmationTemplate,
  bookingReminderTemplate,
} from '@/lib/email/templates';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, to, data } = body;

    if (!to || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: to, type' },
        { status: 400 }
      );
    }

    let subject = '';
    let html = '';

    switch (type) {
      case 'order-confirmation':
        subject = `Order Confirmation #${data.orderNumber}`;
        html = orderConfirmationTemplate(data);
        break;

      case 'invoice':
        subject = `Invoice #${data.orderNumber}`;
        html = invoiceTemplate(data);
        break;

      case 'receipt':
        subject = `Payment Receipt #${data.orderNumber}`;
        html = receiptTemplate(data.order, data.payment);
        break;

      case 'booking-confirmation':
        subject = `Booking Confirmed - ${data.service}`;
        html = bookingConfirmationTemplate(data);
        break;

      case 'booking-reminder':
        subject = `Reminder: Your Appointment Tomorrow`;
        html = bookingReminderTemplate(data);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        );
    }

    const result = await sendEmail({ to, subject, html });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Email sent successfully',
        messageId: result.messageId,
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send email', details: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
