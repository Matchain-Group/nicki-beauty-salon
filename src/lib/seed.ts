import connectDB from './mongodb';
import User from './models/User';
import Product from './models/Product';
import bcrypt from 'bcryptjs';

const seedProducts = [
  {
    title: 'Luxury Hair Treatment',
    description: 'Premium hair treatment for damaged and dry hair. Contains natural oils and vitamins.',
    price: 45,
    image: '/images/hair-treatment.jpg',
    category: 'Hair',
    stock: 20,
  },
  {
    title: 'Glow Facial Kit',
    description: 'Complete facial kit for glowing skin. Includes cleanser, toner, and moisturizer.',
    price: 38,
    image: '/images/facial-kit.jpg',
    category: 'Skin',
    stock: 15,
  },
  {
    title: 'Lash Extension Set',
    description: 'Professional lash extension kit with various sizes and adhesive.',
    price: 25,
    image: '/images/lash-set.jpg',
    category: 'Lashes',
    stock: 30,
  },
  {
    title: 'Hair Growth Oil',
    description: 'Natural hair growth oil with essential vitamins for stronger, longer hair.',
    price: 18,
    image: '/images/hair-oil.jpg',
    category: 'Hair',
    stock: 25,
  },
  {
    title: 'Body Butter Cream',
    description: 'Luxurious body butter for soft, moisturized skin with natural ingredients.',
    price: 15,
    image: '/images/body-butter.jpg',
    category: 'Body',
    stock: 40,
  },
  {
    title: 'Nail Art Kit',
    description: 'Complete nail art kit with colors, tools, and accessories for beautiful nails.',
    price: 20,
    image: '/images/nail-kit.jpg',
    category: 'Nails',
    stock: 35,
  },
];

const seedPortfolio = [
  {
    title: 'Elegant Wedding Hairstyle',
    image: '/images/wedding-hair.jpg',
    category: 'Hair Styling',
  },
  {
    title: 'Volume Lash Extensions',
    image: '/images/volume-lashes.jpg',
    category: 'Lash Extensions',
  },
  {
    title: 'Radiant Facial Treatment',
    image: '/images/facial-treatment.jpg',
    category: 'Facial Treatment',
  },
  {
    title: 'Creative Nail Art Design',
    image: '/images/nail-art.jpg',
    category: 'Nail Art',
  },
  {
    title: 'Professional Makeup Look',
    image: '/images/makeup-look.jpg',
    category: 'Makeup',
  },
  {
    title: 'Hair Color Transformation',
    image: '/images/hair-color.jpg',
    category: 'Hair Styling',
  },
];

export async function seedDatabase() {
  try {
    await connectDB();

    // Check if admin user exists
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (adminEmail && adminPassword) {
      const existingAdmin = await User.findOne({ email: adminEmail });
      
      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await User.create({
          name: 'Admin User',
          email: adminEmail,
          password: hashedPassword,
          role: 'admin',
        });
        console.log('Admin user created successfully');
      }
    }

    // Check if products exist
    const existingProducts = await Product.countDocuments();
    
    if (existingProducts === 0) {
      await Product.insertMany(seedProducts);
      console.log('Products seeded successfully');
    }

    // Check if portfolio items exist
    const PortfolioItem = require('./models/PortfolioItem').default;
    const existingPortfolio = await PortfolioItem.countDocuments();
    
    if (existingPortfolio === 0) {
      await PortfolioItem.insertMany(seedPortfolio);
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
