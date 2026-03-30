import connectDB from './mongodb';
import User from './models/User';
import Product from './models/Product';
import bcrypt from 'bcryptjs';
import { getStaticPortfolioItems } from './portfolioData';
import { getStaticProducts } from './productData';

export async function seedDatabase() {
  try {
    await connectDB();

    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@nickibeauty.com').trim().toLowerCase();
    const adminUsername = (process.env.ADMIN_USERNAME || 'admin').trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await User.updateOne(
      { $or: [{ email: adminEmail }, { username: adminUsername }] },
      {
        $set: {
          name: 'Admin User',
          email: adminEmail,
          username: adminUsername,
          password: hashedPassword,
          role: 'admin',
          isBlacklisted: false,
        },
      },
      { upsert: true }
    );
    console.log('Admin user ensured successfully');

    // Check if products exist
    const existingProducts = await Product.countDocuments();
    
    if (existingProducts === 0) {
      await Product.insertMany(getStaticProducts());
      console.log('Products seeded successfully');
    }

    // Check if portfolio items exist
    const PortfolioItem = require('./models/PortfolioItem').default;
    const existingPortfolio = await PortfolioItem.countDocuments();

    if (existingPortfolio === 0) {
      await PortfolioItem.insertMany(getStaticPortfolioItems());
      console.log('Portfolio items seeded successfully');
    }

    console.log('Database seeding completed');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}
