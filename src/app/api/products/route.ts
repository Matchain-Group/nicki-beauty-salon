import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { requireAdmin } from '@/lib/apiAuth';
import { getStaticProducts } from '@/lib/productData';

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 }).lean();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(getStaticProducts());
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdmin(request);
    if (authError) {
      return authError;
    }

    const body = await request.json();
    const { title, description, price, image, category, stock, isActive = true } = body;

    const numericPrice = Number(price);
    const numericStock = stock === undefined || stock === null ? 0 : Number(stock);

    if (!title || !description || price === undefined || price === null || price === '' || !image || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      return NextResponse.json(
        { error: 'Price must be a valid number' },
        { status: 400 }
      );
    }

    if (Number.isNaN(numericStock) || numericStock < 0) {
      return NextResponse.json(
        { error: 'Stock must be a valid number' },
        { status: 400 }
      );
    }

    await connectDB();
    const product = await Product.create({
      title,
      description,
      price: numericPrice,
      image,
      category,
      stock: numericStock,
      isActive,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
