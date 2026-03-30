import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

async function getAuthToken(request: NextRequest) {
  return getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
}

export async function requireAdmin(request: NextRequest) {
  const token = await getAuthToken(request)
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (token.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  return null
}

export async function requireSelfOrAdmin(request: NextRequest, email: string) {
  const token = await getAuthToken(request)
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (token.role === 'admin') {
    return null
  }

  const tokenEmail = String(token.email || '').toLowerCase()
  if (tokenEmail && tokenEmail === email.toLowerCase()) {
    return null
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
