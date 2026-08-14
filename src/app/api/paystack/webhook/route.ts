import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import { sendReceipt } from '@/lib/email/service';

// Paystack webhook secret from environment variables
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || '';

export async function POST(request: NextRequest) {
  try {
    // Get the raw body for signature verification
    const rawBody = await request.text();
    const signature = request.headers.get('x-paystack-signature');

    // Verify webhook signature (security check). When a secret is configured,
    // a valid signature is mandatory — otherwise anyone could forge this payload.
    if (!PAYSTACK_SECRET) {
      console.error('PAYSTACK_SECRET_KEY is not configured — webhook signature verification disabled');
    } else if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    } else {
      const hash = crypto
        .createHmac('sha512', PAYSTACK_SECRET)
        .update(rawBody)
        .digest('hex');

      if (hash !== signature) {
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    }

    // Parse the webhook payload
    const event = JSON.parse(rawBody);
    const { event: eventType, data } = event;

    console.log('Paystack webhook received:', eventType);

    // Handle successful charge
    if (eventType === 'charge.success') {
      const { reference, status, amount, customer, metadata } = data;

      await connectDB();

      // Find order by Paystack reference. The cart creates the order before
      // redirecting to Paystack; create one here as a fallback if it is missing
      // so a successful charge is always recorded.
      let order = await Order.findOne({ paystackRef: reference });

      if (!order) {
        const items = metadata?.items || [];
        const priceOf = items.reduce(
          (total: number, i: any) => total + (Number(i.price) || 0) * (Number(i.quantity) || 1),
          0
        );
        order = await Order.create({
          customerName: customer?.email || metadata?.email || 'Customer',
          email: customer?.email || metadata?.email || '',
          phone: metadata?.phone || '',
          products: items.map((i: any) => ({
            productId: i.id,
            title: i.title,
            price: i.price,
            quantity: i.quantity || 1,
          })),
          total: Number(metadata?.total) || (amount ? amount / 100 : priceOf),
          paystackRef: reference,
          status: 'paid',
          paidAt: new Date(),
        });
        console.log('Order created from webhook for reference:', reference);
      }

      // Update order status using the actual schema fields
      order.status = 'paid';
      order.paidAt = new Date();
      await order.save();

      // Prepare order data for email receipt
      const orderForEmail = {
        _id: order._id.toString(),
        customerName: order.customerName,
        customerEmail: order.email,
        orderNumber: order.paystackRef,
        createdAt: order.createdAt,
        paymentStatus: 'paid',
        items: order.products.map((p: any) => ({
          name: p.title,
          quantity: p.quantity || 1,
          price: p.price,
        })),
        totalAmount: order.total,
      };

      // Prepare payment data for email receipt
      const paymentData = {
        reference: reference,
        transactionId: data.id || reference,
        amount: amount / 100, // Convert from kobo to naira
        status: status,
        paidAt: new Date().toISOString(),
        channel: data.channel || 'card',
      };

      // Send payment receipt email
      await sendReceipt(orderForEmail, paymentData);

      console.log('Payment receipt sent for order:', order._id);
    }

    // Return 200 to acknowledge receipt
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Paystack webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Next.js App Router automatically handles raw body access
// No config needed - request.text() works directly
