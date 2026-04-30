import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI?.trim();

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in .env.local');
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

console.log('🔗 MongoDB URI found:', MONGODB_URI.substring(0, 50) + '...');

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: Cached;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    console.log('✅ Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    console.log('🔄 Creating new MongoDB connection...');
    cached.promise = mongoose.connect(MONGODB_URI!, opts);
  }

  try {
    cached.conn = await cached.promise;
    console.log('✅ MongoDB connected successfully');
    return cached.conn;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    console.error('❌ Connection string being used:', MONGODB_URI);
    cached.promise = null;
    throw new Error('Failed to connect to MongoDB. Please check your connection string and network.');
  }
}

export default connectDB;
