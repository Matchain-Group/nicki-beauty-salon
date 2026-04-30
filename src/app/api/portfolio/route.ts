import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PortfolioItem from '@/lib/models/PortfolioItem';

export async function GET() {
  try {
    await connectDB();
    const portfolioItems = await PortfolioItem.find({ isPublished: true }).sort({ createdAt: -1 });
    return NextResponse.json(portfolioItems);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch portfolio items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, image, category } = body;

    if (!title || !image || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();
    const portfolioItem = await PortfolioItem.create({
      title,
      image,
      category,
    });

    return NextResponse.json(portfolioItem, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create portfolio item' },
      { status: 500 }
    );
  }
}
