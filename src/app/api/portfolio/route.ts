import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PortfolioItem from '@/lib/models/PortfolioItem';
import { requireAdmin } from '@/lib/apiAuth';
import { getStaticPortfolioItems, mergePortfolioItems } from '@/lib/portfolioData';

export async function GET() {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.json(getStaticPortfolioItems());
    }

    await connectDB();
    const portfolioItems = await PortfolioItem.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(mergePortfolioItems(portfolioItems));
  } catch (error) {
    return NextResponse.json(getStaticPortfolioItems());
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdmin(request);
    if (authError) {
      return authError;
    }

    const body = await request.json();
    const { title, image, category, section = 'Portfolio' } = body;

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
      section,
    });

    return NextResponse.json(portfolioItem, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create portfolio item' },
      { status: 500 }
    );
  }
}
