import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/lib/models/Booking';
import { sendBookingReceived } from '@/lib/email/service';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const email = request.nextUrl.searchParams.get('email');
    const query = email ? { email: email.toLowerCase() } : {};
    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    await connectDB()

    const body = await req.json()
    console.log("Incoming booking:", body)

    const {
      customerName,
      email,
      phone,
      service,
      date,
      time,
      notes
    } = body

    // Validate all required fields
    if (!customerName || customerName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Name must be at least 2 characters' },
        { status: 400 }
      )
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid email address is required' },
        { status: 400 }
      )
    }

    if (!phone || phone.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'Phone number must be at least 10 digits' },
        { status: 400 }
      )
    }

    if (!service || service.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Service selection is required' },
        { status: 400 }
      )
    }

    if (!date) {
      return NextResponse.json(
        { success: false, error: 'Date selection is required' },
        { status: 400 }
      )
    }

    if (!time) {
      return NextResponse.json(
        { success: false, error: 'Time selection is required' },
        { status: 400 }
      )
    }

    const booking = await Booking.create({
      customerName,
      email,
      phone,
      service,
      date: new Date(date),
      time,
      notes
    })

    // Send a receipt-style email to the customer and CC the admin copy via BCC.
    try {
      const bookingForEmail = {
        _id: booking._id.toString(),
        customerName: booking.customerName,
        customerEmail: booking.email,
        service: booking.service,
        date: booking.date,
        time: booking.time,
        bookingId: booking._id.toString().slice(-6).toUpperCase(),
      };
      await sendBookingReceived({
        ...bookingForEmail,
        phone: booking.phone,
        notes: booking.notes,
        email: booking.email,
      })
    } catch (emailError) {
      console.log("Email failed but booking saved:", emailError)
    }

    return NextResponse.json({
      success: true,
      message: 'Booking created',
      data: booking
    })

  } catch (error) {
    console.error("BOOKING ERROR:", error)
    
    // Check if it's a MongoDB connection error
    if (error instanceof Error && error.message.includes('MongoDB')) {
      return NextResponse.json(
        { success: false, error: 'Database connection failed. Please try again later.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create booking. Please try again.' },
      { status: 500 }
    )
  }
}
