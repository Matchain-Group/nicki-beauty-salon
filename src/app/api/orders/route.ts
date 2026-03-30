import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import { sendOrderConfirmation, sendInvoice } from '@/lib/email/service';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get email from query params for filtering
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    let query = {};
    if (email) {
      query = { email: email.toLowerCase() };
    }
    
    const orders = await Order.find(query).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, email, phone, products, total, paystackRef } = body;

    if (
      !customerName ||
      !email ||
      !phone ||
      !Array.isArray(products) ||
      products.length === 0 ||
      !total ||
      !paystackRef
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();
    const order = await Order.create({
      customerName,
      email: email.toLowerCase(),
      phone,
      products,
      total,
      paystackRef,
    });

    // Prepare order data for email
    const orderForEmail = {
      _id: order._id.toString(),
      customerName: order.customerName,
      customerEmail: order.email,
      orderNumber: order.paystackRef,
      createdAt: order.createdAt,
      paymentStatus: 'pending',
      items: order.products.map((p: any) => ({
        name: p.title,
        quantity: p.quantity || 1,
        price: p.price,
      })),
      totalAmount: order.total,
    };

    // Send order confirmation email
    await sendOrderConfirmation(orderForEmail);

    // Send invoice if payment is pending
    await sendInvoice(orderForEmail);

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
