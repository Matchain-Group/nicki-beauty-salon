import { NextRequest, NextResponse } from 'next/server'

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

    const secretKey = process.env.PAYSTACK_SECRET_KEY
    
    if (!secretKey) {
      return NextResponse.json(
        { error: 'Paystack secret key not configured' },
        { status: 500 }
      )
    }

    const response = await fetch(
      'https://api.paystack.co/transaction/initialize',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          amount: Math.round(amount * 100),
          metadata: metadata || {},
          currency: 'USD',
          callback_url: `${process.env.NEXTAUTH_URL}/payment/verify`,
        }),
      }
    )

    const data = await response.json()

    if (!data.status) {
      console.error('Paystack error:', data)
      return NextResponse.json(
        { error: data.message || 'Payment initialization failed' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        authorization_url: data.data.authorization_url,
        access_code: data.data.access_code,
        reference: data.data.reference,
      }
    })
  } catch (error) {
    console.error('Payment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
