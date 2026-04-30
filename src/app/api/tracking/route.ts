import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Tracking API inspired by github.com/infosaqib/Tracking-API
// Supports multiple carriers: UPS, FedEx, DHL, USPS

const TRACKING_APIS: Record<string, string> = {
  ups: 'https://www.ups.com/api/track',
  fedex: 'https://apis.fedex.com/track/v1/trackingnumbers',
  dhl: 'https://api-eu.dhl.com/track/shipments',
  usps: 'https://tools.usps.com/go/TrackConfirmAction',
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const trackingNumber = searchParams.get('number');
  const carrier = searchParams.get('carrier')?.toLowerCase();

  if (!trackingNumber) {
    return NextResponse.json(
      { error: 'Tracking number is required' },
      { status: 400 }
    );
  }

  // Mock tracking response for demo (replace with real API calls)
  const mockTrackingData = {
    trackingNumber,
    carrier: carrier || 'unknown',
    status: 'in_transit',
    estimatedDelivery: '2026-03-30',
    origin: 'Lagos, Nigeria',
    destination: 'Customer Address',
    events: [
      {
        date: '2026-03-27',
        time: '14:30',
        location: 'Lagos Distribution Center',
        status: 'Package in transit',
        description: 'Your package has left the distribution center',
      },
      {
        date: '2026-03-27',
        time: '09:15',
        location: 'Nicki Beauty Salon',
        status: 'Shipped',
        description: 'Package has been shipped',
      },
      {
        date: '2026-03-27',
        time: '08:00',
        location: 'Nicki Beauty Salon',
        status: 'Order Processed',
        description: 'Order has been processed and packed',
      },
    ],
  };

  return NextResponse.json({
    success: true,
    data: mockTrackingData,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { trackingNumber, carrier, orderId } = body;

    if (!trackingNumber) {
      return NextResponse.json(
        { error: 'Tracking number is required' },
        { status: 400 }
      );
    }

    // Create new tracking entry
    const trackingData = {
      id: `TRK-${Date.now()}`,
      trackingNumber,
      carrier: carrier || 'standard',
      orderId: orderId || null,
      status: 'pending',
      createdAt: new Date().toISOString(),
      events: [
        {
          date: new Date().toISOString(),
          status: 'Tracking Created',
          description: 'Tracking number has been registered',
        },
      ],
    };

    return NextResponse.json({
      success: true,
      message: 'Tracking created successfully',
      data: trackingData,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
