import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/lib/models/Booking';
import { sendBookingApproved } from '@/lib/email/service';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status } = body;

    if (!status || !['pending', 'confirmed', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    await connectDB();
    const booking = await Booking.findByIdAndUpdate(
      params.id,
      { status },
      { returnDocument: 'after' }
    );

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    if (status === 'confirmed') {
      await sendBookingApproved({
        _id: booking._id.toString(),
        customerName: booking.customerName,
        customerEmail: booking.email,
        service: booking.service,
        date: booking.date,
        time: booking.time,
        bookingId: booking._id.toString().slice(-6).toUpperCase(),
        duration: booking.duration,
        price: booking.price,
      });
    }

    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}
