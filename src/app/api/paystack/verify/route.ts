import mongoose from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/lib/models/Order'
import { sendReceipt } from '@/lib/email/service'

export const dynamic = 'force-dynamic'

function normalizeCheckoutItems(rawItems: unknown) {
  if (!Array.isArray(rawItems)) {
    return []
  }

  return rawItems
    .map((item: any) => ({
      id: String(item?.id || ''),
      title: String(item?.title || ''),
      price: Number(item?.price || 0),
      quantity: Math.max(1, Number(item?.quantity || 1)),
    }))
    .filter((item) => item.title.length > 0 && item.price > 0)
}

export async function GET(request: NextRequest) {
  try {
    const reference = request.nextUrl.searchParams.get('reference')

    if (!reference) {
      return NextResponse.json(
        { error: 'Reference is required' },
        { status: 400 }
      )
    }

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    })

    const data = await response.json()

    if (!data.status || data.data.status !== 'success') {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      )
    }

    const verifiedEmail = String(data.data.customer?.email || '').toLowerCase()
    const metadata = data.data.metadata || {}
    const normalizedItems = normalizeCheckoutItems(metadata.items)
    const paymentData = {
      reference: data.data.reference,
      transactionId: data.data.id || data.data.reference,
      amount: Number(data.data.amount || 0) / 100,
      status: data.data.status,
      paidAt: new Date().toISOString(),
      channel: data.data.channel || 'card',
    }

    const fallbackOrderForEmail = {
      _id: reference,
      customerName: metadata.customerName || verifiedEmail.split('@')[0] || 'Customer',
      customerEmail: verifiedEmail || 'guest@nickibeauty.com',
      orderNumber: reference,
      createdAt: new Date(),
      paymentStatus: 'paid',
      items: normalizedItems.map((item) => ({
        name: item.title,
        quantity: item.quantity || 1,
        price: item.price,
      })),
      totalAmount: Number(data.data.amount || 0) / 100,
    }

    let order: any = null

    try {
      await connectDB()

      order = await Order.findOne({ paystackRef: reference })

      if (!order && normalizedItems.length > 0) {
        const products = normalizedItems.map((item) => ({
          productId: mongoose.Types.ObjectId.isValid(item.id)
            ? new mongoose.Types.ObjectId(item.id)
            : new mongoose.Types.ObjectId(),
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        }))

        order = await Order.create({
          customerName: metadata.customerName || verifiedEmail.split('@')[0] || 'Customer',
          email: verifiedEmail || 'guest@nickibeauty.com',
          phone: metadata.phone || 'N/A',
          products,
          total: Number(data.data.amount || 0) / 100,
          paystackRef: reference,
          status: 'pending',
        })
      }

      if (order) {
        order.status = 'paid'
        order.paidAt = new Date()
        await order.save()
      }
    } catch (dbError) {
      console.warn('Payment verified, but database persistence failed:', dbError)
    }

    const orderForEmail = order
      ? {
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
      : fallbackOrderForEmail

    try {
      await sendReceipt(orderForEmail, paymentData)

      if (order) {
        order.receiptSentAt = new Date()
        await order.save()
      }
    } catch (mailError) {
      console.warn('Could not send receipt email:', mailError)
    }

    return NextResponse.json({
      success: true,
      data: {
        reference: data.data.reference,
        amount: data.data.amount / 100,
        email: data.data.customer.email,
        status: data.data.status,
      },
    })
  } catch (error) {
    console.error('Verify error:', error)
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    )
  }
}
