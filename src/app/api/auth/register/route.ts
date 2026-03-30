import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
  console.log('Registration attempt started');

  try {
    const body = await request.json();
    console.log('Request body:', {
      name: body?.name,
      email: body?.email,
      hasPassword: !!body?.password,
    });

    const name = String(body?.name || '').trim();
    const email = String(body?.email || '').trim();
    const password = String(body?.password || '');

    // Validate input
    if (!name || !email || !password) {
      console.log('Validation failed: Missing fields');
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      console.log('Validation failed: Password too short');
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('MongoDB connected successfully');

    // Check if user already exists
    const normalizedEmail = email.toLowerCase();
    console.log('Checking for existing user:', normalizedEmail);
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      console.log('User already exists:', normalizedEmail);
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with customer role
    console.log('Creating user...');
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: 'customer',
    });

    console.log('User created successfully:', user._id);
    return NextResponse.json(
      { 
        success: true,
        message: 'User created successfully',
        userId: user._id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    console.error('Error name:', error?.name);
    console.error('Error code:', error?.code);
    console.error('Error message:', error?.message);

    if (error?.code === 11000 && error?.keyValue?.email) {
      return NextResponse.json(
        { error: 'Email already registered', code: 'DUPLICATE_EMAIL' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to create user',
        details: error?.message || 'Unknown error',
        code: error?.code || 'UNKNOWN',
      },
      { status: 500 }
    );
  }
}
