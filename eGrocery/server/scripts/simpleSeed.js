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

const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('Starting database seeding...');
    
    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});
    
    // Create categories
    const categories = await Category.insertMany([
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
      }
    ]);
    
    console.log('Categories seeded successfully');
    
    // Create products one by one
    const productData = [
      {
        name: 'Fresh Bananas',
        description: 'Sweet and ripe bananas, perfect for snacking or smoothies',
        price: 2.99,
        originalPrice: 3.49,
        category: categories[0]._id,
        stock: {
          quantity: 150
        },
        images: [{
          url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop&crop=center',
          alt: 'Fresh Bananas',
          isPrimary: true
        }],
        isFeatured: true,
        isOnSale: true
      },
      {
        name: 'Red Apples',
        description: 'Crisp and juicy red apples, great for eating fresh or baking',
        price: 4.99,
        category: categories[0]._id,
        stock: {
          quantity: 200
        },
        images: [{
          url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop&crop=center',
          alt: 'Red Apples',
          isPrimary: true
        }],
        isFeatured: true
      },
      {
        name: 'Fresh Broccoli',
        description: 'Nutritious green broccoli, perfect for steaming or stir-frying',
        price: 3.49,
        category: categories[1]._id,
        stock: {
          quantity: 90
        },
        images: [{
          url: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=400&fit=crop&crop=center',
          alt: 'Fresh Broccoli',
          isPrimary: true
        }],
        isFeatured: true
      },
      {
        name: 'Whole Milk',
        description: 'Fresh whole milk from local farms',
        price: 3.99,
        category: categories[2]._id,
        stock: {
          quantity: 50
        },
        images: [{
          url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop&crop=center',
          alt: 'Whole Milk',
          isPrimary: true
        }],
        isFeatured: true
      }
    ];
    
    const products = [];
    for (const data of productData) {
      const product = new Product(data);
      await product.save();
      products.push(product);
    }
    
    console.log('Products seeded successfully');
    
    // Create users
    const users = await User.insertMany([
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
      }
    ]);
    
    console.log('Users seeded successfully');
    
    // Update product counts for categories
    for (const category of categories) {
      const productCount = await Product.countDocuments({ category: category._id });
      await Category.findByIdAndUpdate(category._id, { productCount });
    }
    
    console.log('Category product counts updated!');
    console.log('Database seeding completed successfully!');
    
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