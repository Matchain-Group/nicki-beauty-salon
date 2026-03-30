import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PortfolioItem from '@/lib/models/PortfolioItem';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const portfolioItem = await PortfolioItem.findByIdAndDelete(params.id);

    if (!portfolioItem) {
      return NextResponse.json(
        { error: 'Portfolio item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Portfolio item deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete portfolio item' },
      { status: 500 }
    );
  }
}
