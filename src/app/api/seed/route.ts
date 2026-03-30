import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import Product from '@/lib/models/Product'
import PortfolioItem from '@/lib/models/PortfolioItem'
import { getStaticPortfolioItems } from '@/lib/portfolioData'
import { getStaticProducts } from '@/lib/productData'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await connectDB()

    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@nickibeauty.com').trim().toLowerCase()
    const adminUsername = (process.env.ADMIN_USERNAME || 'admin').trim().toLowerCase()
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin'
    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    await User.updateOne(
      {
        $or: [{ email: adminEmail }, { username: adminUsername }],
      },
      {
        $set: {
          name: 'Admin',
          email: adminEmail,
          username: adminUsername,
          password: hashedPassword,
          role: 'admin',
          isBlacklisted: false,
        },
      },
      { upsert: true }
    )

    const productCount = await Product.countDocuments()
    if (productCount === 0) {
      await Product.insertMany(getStaticProducts())
      console.log('Products seeded successfully')
    }

    const portfolioSeedItems = getStaticPortfolioItems()

    for (const item of portfolioSeedItems) {
      await PortfolioItem.updateOne({ title: item.title }, { $set: item }, { upsert: true })
    }
    console.log('Portfolio items upserted successfully')

    return NextResponse.json({ message: 'Seeded successfully' })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    )
  }
}
