import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/lib/models/Order'
import { sendReceipt, sendInvoice } from '@/lib/email/service'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const reference = request.nextUrl.searchParams.get('reference')

    if (!reference) {
      return NextResponse.json(
        { error: 'Reference is required' },
        { status: 400 }
      )
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    )

    const data = await response.json()

    if (!data.status || data.data.status !== 'success') {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      )
    }

    await connectDB()

    const order = await Order.findOneAndUpdate(
      { paystackRef: reference },
      { status: 'paid', paidAt: new Date() },
      { new: true }
    )

    // After a successful redirect-verify, send the receipt + updated invoice
    // directly so the customer gets an email even if Paystack never fires the
    // webhook to this host (e.g. behind a firewall / localhost).
    if (order) {
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
      }

      const paymentData = {
        reference: data.data.reference,
        transactionId: data.data.id || data.data.reference,
        amount: data.data.amount / 100,
        status: data.data.status,
        paidAt: new Date().toISOString(),
        channel: data.data.channel || 'card',
      }

      try {
        await sendReceipt(orderForEmail, paymentData)
        await sendInvoice(orderForEmail)
      } catch (emailError) {
        console.error('Failed to send post-payment email:', emailError)
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        reference: data.data.reference,
        amount: data.data.amount / 100,
        email: data.data.customer.email,
        status: data.data.status,
      }
    })
  } catch (error) {
    console.error('Verify error:', error)
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    )
  }
}
