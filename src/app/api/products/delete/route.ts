import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { requireAdmin } from '@/lib/apiAuth';

export async function DELETE(request: NextRequest) {
  try {
    const authError = await requireAdmin(request);
    if (authError) {
      return authError;
    }

    const confirm = request.nextUrl.searchParams.get('confirm');
    if (confirm !== 'DELETE_ALL') {
      return NextResponse.json(
        { error: 'Missing delete confirmation' },
        { status: 400 }
      );
    }

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
