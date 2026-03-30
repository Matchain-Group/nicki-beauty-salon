import mongoose from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/lib/models/Order'

type CheckoutItem = {
  id: string
  title: string
  quantity: number
  price: number
}

function toOrderItems(rawItems: unknown): CheckoutItem[] {
  if (!Array.isArray(rawItems)) {
    return []
  }

  return rawItems
    .map((item: any) => ({
      id: String(item?.id || ''),
      title: String(item?.title || ''),
      quantity: Math.max(1, Number(item?.quantity || 1)),
      price: Number(item?.price || 0),
    }))
    .filter((item) => item.title.length > 0 && item.price > 0)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, amount, metadata } = body

    if (!email || !amount) {
      return NextResponse.json(
        { error: 'Email and amount are required' },
        { status: 400 }
      )
    }

    const numericAmount = Number(amount)
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a valid number greater than zero' },
        { status: 400 }
      )
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY
    const callbackBase = process.env.NEXT_PUBLIC_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'
    if (!secretKey) {
      return NextResponse.json(
        { error: 'Paystack secret key not configured' },
        { status: 500 }
      )
    }

    const safeMetadata = metadata || {}
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: Math.round(numericAmount * 100),
        metadata: safeMetadata,
        callback_url: `${callbackBase}/payment/verify`,
      }),
    })

    const data = await response.json()

    if (!data.status) {
      console.error('Paystack error:', data)
      return NextResponse.json(
        {
          error: data.message || data?.data?.message || 'Payment initialization failed',
          details: data,
        },
        { status: response.status || 400 }
      )
    }

    const reference = data.data.reference as string
    const checkoutItems = toOrderItems(safeMetadata.items)

    if (checkoutItems.length > 0) {
      try {
        const products = checkoutItems.map((item) => ({
          productId: mongoose.Types.ObjectId.isValid(item.id)
            ? new mongoose.Types.ObjectId(item.id)
            : new mongoose.Types.ObjectId(),
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        }))

        await connectDB()
        await Order.findOneAndUpdate(
          { paystackRef: reference },
          {
            customerName: safeMetadata.customerName || String(email).split('@')[0] || 'Customer',
            email: String(email).toLowerCase(),
            phone: safeMetadata.phone || 'N/A',
            products,
            total: numericAmount,
            paystackRef: reference,
            status: 'pending',
          },
          { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
        )
      } catch (orderError) {
        console.warn('Could not persist pending order before checkout:', orderError)
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        authorization_url: data.data.authorization_url,
        access_code: data.data.access_code,
        reference: data.data.reference,
      },
    })
  } catch (error) {
    console.error('Payment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
