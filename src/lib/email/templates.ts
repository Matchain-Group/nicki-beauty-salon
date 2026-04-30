import { companyInfo } from './config';

// Professional email header with logo
const emailHeader = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Georgia', serif; margin: 0; padding: 0; background-color: #faf7f2; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #3d2314 0%, #5a3a23 100%); padding: 30px; text-align: center; }
    .logo { width: 80px; height: 80px; background: #d4a574; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; color: white; font-size: 36px; font-weight: bold; margin-bottom: 15px; }
    .company-name { color: #d4a574; font-size: 28px; margin: 0; }
    .tagline { color: #ffffff; opacity: 0.8; font-size: 14px; margin-top: 5px; }
    .content { padding: 40px 30px; }
    .footer { background: #3d2314; color: white; padding: 30px; text-align: center; font-size: 14px; }
    .gold-text { color: #d4a574; }
    .btn { display: inline-block; background: #d4a574; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .divider { border-top: 2px solid #d4a574; margin: 30px 0; }
    .info-box { background: #faf7f2; padding: 20px; border-radius: 8px; margin: 20px 0; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #3d2314; color: white; padding: 12px; text-align: left; }
    td { padding: 12px; border-bottom: 1px solid #eee; }
    .total { font-size: 20px; font-weight: bold; color: #3d2314; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">N</div>
      <h1 class="company-name">${companyInfo.name}</h1>
      <p class="tagline">Premium Beauty Services</p>
    </div>
    <div class="content">
`;

const emailFooter = `
    </div>
    <div class="footer">
      <p><strong>${companyInfo.name}</strong></p>
      <p>${companyInfo.address}</p>
      <p>📞 ${companyInfo.phone} | ✉️ ${companyInfo.email}</p>
      <p style="margin-top: 15px;">
        <a href="${companyInfo.website}" style="color: #d4a574;">${companyInfo.website}</a>
      </p>
      <p style="margin-top: 20px; font-size: 12px; opacity: 0.7;">
        © ${new Date().getFullYear()} ${companyInfo.name}. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
`;

// Order Confirmation Email
export const orderConfirmationTemplate = (order: any) => `
${emailHeader}
  <h2 style="color: #3d2314; margin-top: 0;">Thank You for Your Order! 💅</h2>
  <p>Dear ${order.customerName},</p>
  <p>We've received your order and it's being processed. Here are your order details:</p>
  
  <div class="info-box">
    <p><strong>Order Number:</strong> <span class="gold-text">#${order.orderNumber}</span></p>
    <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
    <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
  </div>

  <h3 style="color: #3d2314;">Order Summary</h3>
  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th>Qty</th>
        <th>Price</th>
      </tr>
    </thead>
    <tbody>
      ${order.items.map((item: any) => `
        <tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>₦${item.price.toLocaleString()}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="divider"></div>
  
  <p class="total">Total: ₦${order.totalAmount.toLocaleString()}</p>

  <p style="margin-top: 30px;">We'll send you an invoice shortly. If you've already paid, you'll receive a receipt.</p>
  
  <a href="${companyInfo.website}/orders/${order._id}" class="btn">View Order Status</a>
${emailFooter}
`;

// Invoice Email
export const invoiceTemplate = (order: any) => `
${emailHeader}
  <h2 style="color: #3d2314; margin-top: 0;">Invoice #${order.orderNumber}</h2>
  
  <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
    <div>
      <p><strong>Bill To:</strong><br>
      ${order.customerName}<br>
      ${order.customerEmail}<br>
      ${order.shippingAddress || 'N/A'}</p>
    </div>
    <div style="text-align: right;">
      <p><strong>Invoice Date:</strong> ${new Date().toLocaleDateString()}<br>
      <strong>Due Date:</strong> ${new Date(Date.now() + 7*24*60*60*1000).toLocaleDateString()}<br>
      <strong>Status:</strong> <span style="color: #d4a574; font-weight: bold;">${order.paymentStatus}</span></p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th>Quantity</th>
        <th>Unit Price</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      ${order.items.map((item: any) => `
        <tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>₦${item.price.toLocaleString()}</td>
          <td>₦${(item.price * item.quantity).toLocaleString()}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div style="text-align: right; margin-top: 20px;">
    <p><strong>Subtotal:</strong> ₦${order.subtotal?.toLocaleString() || order.totalAmount.toLocaleString()}</p>
    <p><strong>Shipping:</strong> ₦${order.shippingCost?.toLocaleString() || '0'}</p>
    <p><strong>Tax:</strong> ₦${order.tax?.toLocaleString() || '0'}</p>
    <div class="divider"></div>
    <p class="total">Total Due: ₦${order.totalAmount.toLocaleString()}</p>
  </div>

  <div class="info-box" style="margin-top: 30px;">
    <p><strong>Payment Instructions:</strong></p>
    <p>Please complete payment using one of these methods:</p>
    <ul>
      <li>Online Payment: <a href="${companyInfo.website}/pay/${order._id}" style="color: #d4a574;">Pay Now</a></li>
      <li>Bank Transfer: Account details sent separately</li>
      <li>Cash on Delivery: Available for Lagos orders</li>
    </ul>
  </div>

  <p style="font-size: 12px; color: #666; margin-top: 30px;">
    This invoice was generated automatically. For questions, contact us at ${companyInfo.email}
  </p>
${emailFooter}
`;

// Payment Receipt Email
export const receiptTemplate = (order: any, payment: any) => `
${emailHeader}
  <h2 style="color: #3d2314; margin-top: 0;">Payment Received! 🎉</h2>
  <p>Dear ${order.customerName},</p>
  <p>Thank you for your payment. Here's your official receipt:</p>

  <div class="info-box" style="background: #e8f5e9; border-left: 4px solid #4caf50;">
    <p style="color: #2e7d32; font-size: 18px; margin: 0;">
      ✓ Payment Successful
    </p>
    <p style="margin: 10px 0 0 0;">
      <strong>Amount Paid:</strong> ₦${order.totalAmount.toLocaleString()}<br>
      <strong>Transaction ID:</strong> ${payment.reference || payment.transactionId}<br>
      <strong>Date:</strong> ${new Date().toLocaleString()}
    </p>
  </div>

  <h3 style="color: #3d2314;">Receipt Details</h3>
  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th>Qty</th>
        <th>Price</th>
      </tr>
    </thead>
    <tbody>
      ${order.items.map((item: any) => `
        <tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>₦${item.price.toLocaleString()}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="divider"></div>
  <p class="total">Total Paid: ₦${order.totalAmount.toLocaleString()}</p>

  <div style="margin-top: 30px; padding: 20px; background: #faf7f2; border-radius: 8px;">
    <p><strong>What's Next?</strong></p>
    <ul style="line-height: 1.8;">
      <li>Your order is being prepared</li>
      <li>You'll receive tracking information once shipped</li>
      <li>Estimated delivery: 3-5 business days</li>
    </ul>
  </div>

  <a href="${companyInfo.website}/orders/${order._id}" class="btn">Track Your Order</a>
  
  <p style="margin-top: 30px; font-size: 12px;">
    Need help? Reply to this email or call us at ${companyInfo.phone}
  </p>
${emailFooter}
`;

// Booking Confirmation Email
export const bookingConfirmationTemplate = (booking: any) => `
${emailHeader}
  <h2 style="color: #3d2314; margin-top: 0;">Booking Confirmed! ✨</h2>
  <p>Dear ${booking.customerName},</p>
  <p>Your appointment at ${companyInfo.name} has been confirmed. We look forward to seeing you!</p>

  <div class="info-box">
    <h3 style="color: #3d2314; margin-top: 0;">Appointment Details</h3>
    <p><strong>Service:</strong> <span class="gold-text">${booking.service}</span></p>
    <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
    <p><strong>Time:</strong> ${booking.time}</p>
    <p><strong>Duration:</strong> ${booking.duration || '1 hour'}</p>
    <p><strong>Price:</strong> ₦${booking.price?.toLocaleString() || 'Contact us'}</p>
    <p><strong>Booking ID:</strong> #${booking.bookingId || booking._id}</p>
  </div>

  <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff9800;">
    <p style="margin: 0;"><strong>📍 Location:</strong><br>
    ${companyInfo.address}<br>
    <a href="https://maps.google.com" style="color: #d4a574;">Get Directions</a></p>
  </div>

  <h3 style="color: #3d2314;">Important Reminders</h3>
  <ul style="line-height: 1.8;">
    <li>Please arrive 15 minutes early</li>
    <li>Cancellation requires 24 hours notice</li>
    <li>Bring a face mask (if required)</li>
    <li>Payment can be made at the salon or online</li>
  </ul>

  <div style="margin-top: 30px;">
    <a href="${companyInfo.website}/booking/${booking._id}" class="btn">Manage Booking</a>
    <a href="${companyInfo.website}/booking/${booking._id}/reschedule" style="margin-left: 10px; color: #3d2314;">Reschedule</a>
  </div>

  <p style="margin-top: 30px;">
    Questions? Call us at ${companyInfo.phone} or reply to this email.
  </p>
${emailFooter}
`;

// Booking Reminder Email (24 hours before)
export const bookingReminderTemplate = (booking: any) => `
${emailHeader}
  <h2 style="color: #3d2314; margin-top: 0;">Reminder: Your Appointment Tomorrow! ⏰</h2>
  <p>Dear ${booking.customerName},</p>
  <p>This is a friendly reminder about your upcoming appointment at ${companyInfo.name}.</p>

  <div class="info-box" style="background: #e3f2fd; border-left: 4px solid #2196f3;">
    <p style="margin: 0; font-size: 18px;">
      <strong>Tomorrow at ${booking.time}</strong><br>
      ${booking.service}
    </p>
  </div>

  <p style="text-align: center; margin: 30px 0;">
    <a href="${companyInfo.website}/booking/${booking._id}" class="btn">Confirm Attendance</a>
  </p>

  <p style="font-size: 12px; color: #666;">
    Can't make it? <a href="${companyInfo.website}/booking/${booking._id}/cancel" style="color: #d4a574;">Cancel or Reschedule</a>
  </p>
${emailFooter}
`;
