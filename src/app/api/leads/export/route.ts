import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Lead from '@/lib/models/Lead';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const leads = await Lead.find().sort({ createdAt: -1 });

    const csvHeaders = 'Name,Email,Phone,Message,Created At\n';
    const csvData = leads.map(lead => 
      `"${lead.name}","${lead.email}","${lead.phone}","${lead.message}","${lead.createdAt}"`
    ).join('\n');

    const csv = csvHeaders + csvData;
    
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="leads.csv"',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to export leads' },
      { status: 500 }
    );
  }
}
