// Example: How to send emails from API routes or components

import { sendEmail } from '@/lib/email';
import {
  orderConfirmationTemplate,
  invoiceTemplate,
  receiptTemplate,
  bookingConfirmationTemplate,
} from '@/lib/email/templates';

// ============================================
// OPTION 1: Using the Email API Endpoint
// ============================================

// From a React Component:
async function sendOrderConfirmation(orderData: any) {
  const response = await fetch('/api/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'order-confirmation',
      to: orderData.customerEmail,
      data: orderData,
    }),
  });

  const result = await response.json();
  return result;
}

// From an API Route:
async function handleOrder(req: Request) {
  const order = await createOrder(req.body);
  
  // Send confirmation email
  await fetch(`${process.env.NEXT_PUBLIC_URL}/api/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'order-confirmation',
      to: order.customerEmail,
      data: order,
    }),
  });
  
  return order;
}

// ============================================
// OPTION 2: Direct Email Function (Server-side only)
// ============================================

// In an API Route (src/app/api/orders/route.ts):
import { sendEmail } from '@/lib/email';
import { orderConfirmationTemplate } from '@/lib/email/templates';

export async function POST(request: Request) {
  const order = await createOrder(request.body);
  
  // Send email directly
  await sendEmail({
    to: order.customerEmail,
    subject: `Order Confirmation #${order.orderNumber}`,
    html: orderConfirmationTemplate(order),
  });
  
  return Response.json({ success: true, order });
}

// ============================================
// Email Types Available
// ============================================

/*
1. order-confirmation
   - Sends order confirmation with items, total, order number
   
2. invoice
   - Sends professional invoice with payment instructions
   
3. receipt
   - Sends payment receipt after successful payment
   - Requires: data.order and data.payment
   
4. booking-confirmation
   - Confirms appointment booking with details
   
5. booking-reminder
   - Sends reminder 24 hours before appointment
*/

// ============================================
// Usage Examples
// ============================================

// 1. After order creation:
await fetch('/api/email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'order-confirmation',
    to: customerEmail,
    data: {
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      orderNumber: 'ORD-12345',
      createdAt: new Date().toISOString(),
      paymentStatus: 'pending',
      items: [
        { name: 'Hydration Mask', quantity: 2, price: 45 },
        { name: 'Glass Serum', quantity: 1, price: 65 },
      ],
      totalAmount: 155,
      _id: 'order-id-123',
    },
  }),
});

// 2. Send invoice:
await fetch('/api/email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'invoice',
    to: customerEmail,
    data: {
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      orderNumber: 'ORD-12345',
      paymentStatus: 'pending',
      items: [
        { name: 'Hydration Mask', quantity: 2, price: 45 },
      ],
      totalAmount: 155,
      subtotal: 140,
      shippingCost: 15,
      tax: 0,
      shippingAddress: '123 Street, Lagos',
      _id: 'order-id-123',
    },
  }),
});

// 3. After payment:
await fetch('/api/email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'receipt',
    to: customerEmail,
    data: {
      order: {
        customerName: 'John Doe',
        items: [{ name: 'Hydration Mask', quantity: 2, price: 45 }],
        totalAmount: 155,
        _id: 'order-id-123',
      },
      payment: {
        reference: 'PAY-12345',
        transactionId: 'TXN-67890',
      },
    },
  }),
});

// 4. Booking confirmation:
await fetch('/api/email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'booking-confirmation',
    to: customerEmail,
    data: {
      customerName: 'Jane Doe',
      service: 'Hair Relaxer',
      date: '2026-03-30',
      time: '14:00',
      duration: '2 hours',
      price: 150,
      bookingId: 'BK-12345',
      _id: 'booking-id-123',
    },
  }),
});

// ============================================
// Testing
// ============================================

// Test email with curl:
/*
curl -X POST http://localhost:3000/api/email \
  -H "Content-Type: application/json" \
  -d '{
    "type": "order-confirmation",
    "to": "test@example.com",
    "data": {
      "customerName": "Test User",
      "customerEmail": "test@example.com",
      "orderNumber": "ORD-TEST-001",
      "createdAt": "'$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")'",
      "paymentStatus": "pending",
      "items": [
        {"name": "Test Product", "quantity": 1, "price": 100}
      ],
      "totalAmount": 100,
      "_id": "test-order-id"
    }
  }'
*/
