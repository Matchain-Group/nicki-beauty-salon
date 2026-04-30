import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import Product from '@/lib/models/Product'
import PortfolioItem from '@/lib/models/PortfolioItem'

export async function GET() {
  try {
    await connectDB()
    
    // Create admin user if not exists
    const existingAdmin = await User.findOne({ 
      email: process.env.ADMIN_EMAIL 
    })
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD!, 10
      )
      await User.create({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin'
      })
    }

    // Seed products if none exist
    const productCount = await Product.countDocuments()
    if (productCount === 0) {
      await Product.insertMany([
        { title: 'Hydration Mask', price: 45.99, category: 'Skin', description: 'Deep hydration facial mask for glowing skin', image: '/images/hydration-mask.jpg', stock: 50, isActive: true },
        { title: 'Glass Serum', price: 38.99, category: 'Skin', description: 'Advanced glass skin serum with vitamin C', image: '/images/glass-serum.jpg', stock: 30, isActive: true },
        { title: 'Curl Cream', price: 25.99, category: 'Hair', description: 'Premium curl defining cream for natural hair', image: '/images/curl-cream.jpg', stock: 40, isActive: true },
        { title: 'Nail Oil', price: 18.99, category: 'Nails', description: 'Nourishing cuticle and nail growth oil', image: '/images/nail-oil.jpg', stock: 60, isActive: true },
        { title: 'Lash Extensions', price: 85.99, category: 'Lashes', description: 'Professional lash extensions for dramatic look', image: '/images/lash+extensions.jpg', stock: 25, isActive: true },
        { title: 'Facial Treatment', price: 65.99, category: 'Skin', description: 'Rejuvenating facial treatment with natural products', image: '/images/What-is-a-Facial.jpeg', stock: 35, isActive: true },
        { title: 'Pedicure', price: 35.99, category: 'Nails', description: 'Luxury pedicure with foot massage', image: '/images/Pedicure_Images.jpg', stock: 45, isActive: true },
      ])
      console.log('✅ Products seeded successfully')
    }

    // Seed portfolio items if none exist
    const portfolioCount = await PortfolioItem.countDocuments()
    if (portfolioCount === 0) {
      await PortfolioItem.insertMany([
        { title: 'Elegant Hair Styling', image: '/images/hero/hairstyle1.jpg', category: 'Hair Styling', isPublished: true },
        { title: 'Luxury Hair Treatment', image: '/images/hero/treatment1.jpg', category: 'Hair Treatment', isPublished: true },
        { title: 'Professional Styling', image: '/images/hero/style1.jpg', category: 'Hair Styling', isPublished: true },
        { title: 'Facial Treatment', image: '/images/What-is-a-Facial.jpeg', category: 'Facial', isPublished: true },
        { title: 'Lash Extensions', image: '/images/lash+extensions.jpg', category: 'Lashes', isPublished: true },
      ])
      console.log('✅ Portfolio items seeded successfully')
    }

    return NextResponse.json({ 
      message: 'Seeded successfully' 
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    )
  }
}
