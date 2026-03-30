import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
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

    await connectDB();
    const user = await User.findById(params.id);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    user.isBlacklisted = !user.isBlacklisted;
    await user.save();

    return NextResponse.json({
      message: `User ${user.isBlacklisted ? 'blacklisted' : 'unblacklisted'} successfully`,
      isBlacklisted: user.isBlacklisted,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update user blacklist status' },
      { status: 500 }
    );
  }
}
