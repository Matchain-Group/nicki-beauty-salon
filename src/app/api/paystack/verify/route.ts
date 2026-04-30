import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/lib/models/Order'

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
    
    await Order.findOneAndUpdate(
      { paystackRef: reference },
      { paymentStatus: 'paid' },
      { new: true }
    )

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
