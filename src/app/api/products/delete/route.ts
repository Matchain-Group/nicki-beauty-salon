import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product';

export async function DELETE() {
  try {
    await connectDB();
    await Product.deleteMany({});
    return NextResponse.json({ message: 'All products deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete products' },
      { status: 500 }
    );
  }
}
