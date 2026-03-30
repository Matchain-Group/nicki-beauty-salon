import mongoose from 'mongoose'
import dns from 'dns'

const MONGODB_DNS_SERVERS = (process.env.MONGODB_DNS_SERVERS || '8.8.8.8,1.1.1.1')
  .split(',')
  .map((server) => server.trim())
  .filter(Boolean)

interface GlobalMongoose {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongoose: GlobalMongoose
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

let dnsConfigured = false

function configureDnsServers() {
  if (dnsConfigured || MONGODB_DNS_SERVERS.length === 0) {
    return
  }

  try {
    dns.setServers(MONGODB_DNS_SERVERS)
  } catch (_error) {
    // Keep default DNS servers if custom resolver setup fails.
  }

  dnsConfigured = true
}

async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined')
  }

  configureDnsServers()

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      family: 4,
      maxPoolSize: 10,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => mongoose)
  }

  try {
    cached.conn = await cached.promise
  } catch (error) {
    cached.promise = null
    throw error
  }

  return cached.conn
}

export default connectDB
