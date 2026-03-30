import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { requireAdmin } from '@/lib/apiAuth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authError = await requireAdmin(request);
    if (authError) {
      return authError;
    }

    const body = await request.json();
    const update: Record<string, unknown> = {};

    if (typeof body.title === 'string') update.title = body.title;
    if (typeof body.description === 'string') update.description = body.description;
    if (body.price !== undefined) {
      const numericPrice = Number(body.price);
      if (Number.isNaN(numericPrice) || numericPrice < 0) {
        return NextResponse.json(
          { error: 'Price must be a valid number' },
          { status: 400 }
        );
      }
      update.price = numericPrice;
    }
    if (typeof body.image === 'string') update.image = body.image;
    if (typeof body.category === 'string') update.category = body.category;
    if (body.stock !== undefined) {
      const numericStock = Number(body.stock);
      if (Number.isNaN(numericStock) || numericStock < 0) {
        return NextResponse.json(
          { error: 'Stock must be a valid number' },
          { status: 400 }
        );
      }
      update.stock = numericStock;
    }
    if (body.isActive !== undefined) update.isActive = Boolean(body.isActive);

    await connectDB();
    const product = await Product.findByIdAndUpdate(params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authError = await requireAdmin(request);
    if (authError) {
      return authError;
    }

    await connectDB();
    const product = await Product.findByIdAndDelete(params.id);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
