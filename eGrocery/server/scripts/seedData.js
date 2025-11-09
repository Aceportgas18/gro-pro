const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding...');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedCategories = async () => {
  const categories = [
    {
      name: 'Fruits',
      slug: 'fruits',
      description: 'Fresh seasonal fruits',
      image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&h=200&fit=crop&crop=center'
    },
    {
      name: 'Vegetables',
      slug: 'vegetables',
      description: 'Farm fresh vegetables',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&h=200&fit=crop&crop=center'
    },
    {
      name: 'Dairy',
      slug: 'dairy',
      description: 'Fresh dairy products',
      image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&h=200&fit=crop&crop=center'
    },
    {
      name: 'Meat & Seafood',
      slug: 'meat-seafood',
      description: 'Premium meat and seafood',
      image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=200&h=200&fit=crop&crop=center'
    },
    {
      name: 'Bakery',
      slug: 'bakery',
      description: 'Fresh baked goods',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop&crop=center'
    },
    {
      name: 'Pantry',
      slug: 'pantry',
      description: 'Pantry essentials and dry goods',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop&crop=center'
    }
  ];

  await Category.deleteMany({});
  const createdCategories = await Category.insertMany(categories);
  console.log('Categories seeded successfully');
  return createdCategories;
};

const seedProducts = async (categories) => {
  const products = [
    // Fruits
    {
      name: 'Fresh Bananas',
      description: 'Sweet and ripe bananas, perfect for snacking or smoothies',
      price: 2.99,
      originalPrice: 3.49,
      category: categories.find(c => c.name === 'Fruits')._id,
      stock: {
        quantity: 150,
        unit: 'bunch'
      },
      images: [{
        url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop&crop=center',
        alt: 'Fresh Bananas',
        isPrimary: true
      }],
      isFeatured: true,
      isOnSale: true,
      specifications: {
        nutritionalInfo: {
          calories: 89,
          protein: '1.1g',
          carbs: '22.8g',
          fat: '0.3g',
          fiber: '2.6g'
        }
      }
    },
    {
      name: 'Red Apples',
      description: 'Crisp and juicy red apples, great for eating fresh or baking',
      price: 4.99,
      category: categories.find(c => c.name === 'Fruits')._id,
      stock: 200,
      unit: 'lb',
      primaryImage: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop&crop=center',
      images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop&crop=center'],
      isFeatured: true
    },
    {
      name: 'Fresh Strawberries',
      description: 'Sweet, juicy strawberries perfect for desserts and snacking',
      price: 5.99,
      category: categories.find(c => c.name === 'Fruits')._id,
      stock: 80,
      unit: 'container',
      primaryImage: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop&crop=center',
      images: ['https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop&crop=center'],
      isFeatured: true
    },
    {
      name: 'Orange Juice Oranges',
      description: 'Juicy oranges perfect for fresh juice or eating',
      price: 3.99,
      category: categories.find(c => c.name === 'Fruits')._id,
      stock: 120,
      unit: 'bag',
      primaryImage: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=400&fit=crop&crop=center',
      images: ['https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=400&fit=crop&crop=center']
    },

    // Vegetables
    {
      name: 'Fresh Broccoli',
      description: 'Nutritious green broccoli, perfect for steaming or stir-frying',
      price: 3.49,
      category: categories.find(c => c.name === 'Vegetables')._id,
      stock: 90,
      unit: 'head',
      primaryImage: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=400&fit=crop&crop=center',
      images: ['https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=400&fit=crop&crop=center'],
      isFeatured: true
    },
    {
      name: 'Organic Carrots',
      description: 'Sweet and crunchy organic carrots, great for snacking or cooking',
      price: 2.79,
      category: categories.find(c => c.name === 'Vegetables')._id,
      stock: 160,
      unit: 'bunch',
      primaryImage: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=400&h=400&fit=crop&crop=center',
      images: ['https://images.unsplash.com/photo-1445282768818-728615cc910a?w=400&h=400&fit=crop&crop=center']
    },
    {
      name: 'Fresh Spinach',
      description: 'Tender baby spinach leaves, perfect for salads and smoothies',
      price: 4.29,
      category: categories.find(c => c.name === 'Vegetables')._id,
      stock: 70,
      unit: 'bag',
      primaryImage: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop&crop=center',
      images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop&crop=center'],
      isFeatured: true
    },
    {
      name: 'Red Bell Peppers',
      description: 'Sweet and colorful red bell peppers, great for cooking',
      price: 5.99,
      category: categories.find(c => c.name === 'Vegetables')._id,
      stock: 85,
      unit: 'lb',
      primaryImage: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=400&fit=crop&crop=center',
      images: ['https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=400&fit=crop&crop=center']
    },

    // Dairy
    {
      name: 'Whole Milk',
      description: 'Fresh whole milk from local farms',
      price: 3.99,
      category: categories.find(c => c.name === 'Dairy')._id,
      stock: 50,
      unit: 'gallon',
      primaryImage: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop&crop=center',
      images: ['https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop&crop=center'],
      isFeatured: true
    },
    {
      name: 'Greek Yogurt',
      description: 'Creamy Greek yogurt, high in protein',
      price: 5.49,
      category: categories.find(c => c.name === 'Dairy')._id,
      stock: 40,
      unit: 'container',
      primaryImage: 'https://images.unsplash.com/photo-1571212515416-fca0bf4c0b8e?w=400&h=400&fit=crop&crop=center',
      images: ['https://images.unsplash.com/photo-1571212515416-fca0bf4c0b8e?w=400&h=400&fit=crop&crop=center']
    },

    // Meat & Seafood
    {
      name: 'Fresh Salmon Fillet',
      description: 'Premium Atlantic salmon fillet, rich in omega-3',
      price: 12.99,
      originalPrice: 15.99,
      category: categories.find(c => c.name === 'Meat & Seafood')._id,
      stock: 25,
      unit: 'lb',
      primaryImage: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&h=400&fit=crop&crop=center',
      images: ['https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&h=400&fit=crop&crop=center'],
      isFeatured: true,
      isOnSale: true
    },
    {
      name: 'Organic Chicken Breast',
      description: 'Lean organic chicken breast, perfect for healthy meals',
      price: 8.99,
      category: categories.find(c => c.name === 'Meat & Seafood')._id,
      stock: 35,
      unit: 'lb',
      primaryImage: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop&crop=center',
      images: ['https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop&crop=center']
    },

    // Bakery
    {
      name: 'Artisan Sourdough Bread',
      description: 'Freshly baked artisan sourdough bread',
      price: 4.99,
      category: categories.find(c => c.name === 'Bakery')._id,
      stock: 20,
      unit: 'loaf',
      primaryImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop&crop=center',
      images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop&crop=center'],
      isFeatured: true
    },
    {
      name: 'Fresh Croissants',
      description: 'Buttery, flaky croissants baked fresh daily',
      price: 6.99,
      category: categories.find(c => c.name === 'Bakery')._id,
      stock: 30,
      unit: 'pack of 6',
      primaryImage: 'https://images.unsplash.com/photo-1555507036-ab794f4afe5e?w=400&h=400&fit=crop&crop=center',
      images: ['https://images.unsplash.com/photo-1555507036-ab794f4afe5e?w=400&h=400&fit=crop&crop=center']
    },

    // Pantry
    {
      name: 'Organic Brown Rice',
      description: 'Nutritious organic brown rice, perfect for healthy meals',
      price: 7.99,
      category: categories.find(c => c.name === 'Pantry')._id,
      stock: 100,
      unit: '2lb bag',
      primaryImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop&crop=center',
      images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop&crop=center']
    },
    {
      name: 'Extra Virgin Olive Oil',
      description: 'Premium extra virgin olive oil from Mediterranean olives',
      price: 12.99,
      category: categories.find(c => c.name === 'Pantry')._id,
      stock: 60,
      unit: '500ml bottle',
      primaryImage: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop&crop=center',
      images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop&crop=center']
    }
  ];

  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log('Products seeded successfully');
};

const seedUsers = async () => {
  const users = [
    {
      name: 'Admin User',
      email: 'admin@egrocery.com',
      password: await bcrypt.hash('admin123', 12),
      role: 'admin',
      isVerified: true
    },
    {
      name: 'John Doe',
      email: 'john@example.com',
      password: await bcrypt.hash('password123', 12),
      role: 'customer',
      isVerified: true,
      address: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        country: 'USA'
      },
      phone: '+1-555-123-4567'
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: await bcrypt.hash('password123', 12),
      role: 'customer',
      isVerified: true,
      address: {
        street: '456 Oak Ave',
        city: 'Somewhere',
        state: 'NY',
        zipCode: '67890',
        country: 'USA'
      },
      phone: '+1-555-987-6543'
    }
  ];

  await User.deleteMany({});
  await User.insertMany(users);
  console.log('Users seeded successfully');
};

const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('Starting database seeding...');
    
    const categories = await seedCategories();
    await seedProducts(categories);
    await seedUsers();
    
    console.log('Database seeding completed successfully!');
    
    // Update product counts for categories
    for (const category of categories) {
      const productCount = await Product.countDocuments({ category: category._id });
      await Category.findByIdAndUpdate(category._id, { productCount });
    }
    
    console.log('Category product counts updated!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };