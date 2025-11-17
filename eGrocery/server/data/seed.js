const mongoose = require('mongoose');
const colors = require('colors');
require('dotenv').config();

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.red);
    process.exit(1);
  }
};

// Sample data
const users = [
  {
    name: 'Admin User',
    email: process.env.ADMIN_EMAIL || 'admin@egrocery.com',
    password: process.env.ADMIN_PASSWORD || 'Admin123',
    role: 'admin',
    phone: '+1-555-0100',
    address: {
      street: '123 Admin St',
      city: 'Admin City',
      state: 'AC',
      zipCode: '12345',
      country: 'USA'
    }
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'Password123',
    role: 'customer',
    phone: '+1-555-0101',
    address: {
      street: '456 Customer Ave',
      city: 'Customer City',
      state: 'CC',
      zipCode: '67890',
      country: 'USA'
    }
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'Password123',
    role: 'customer',
    phone: '+1-555-0102',
    address: {
      street: '789 Buyer Blvd',
      city: 'Buyer City',
      state: 'BC',
      zipCode: '54321',
      country: 'USA'
    }
  },
  {
    name: 'Thiru',
    email: 'thiru212004@gmail.com',
    password: 'Abc@123',
    role: 'customer',
    phone: '+1-555-0103',
    address: {
      street: '123 User St',
      city: 'User City',
      state: 'UC',
      zipCode: '12345',
      country: 'USA'
    }
  }
];

const categories = [
  {
    name: 'Fruits',
    description: 'Fresh and organic fruits',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=300&h=200&fit=crop',
    sortOrder: 1
  },
  {
    name: 'Vegetables',
    description: 'Farm fresh vegetables',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop',
    sortOrder: 2
  },
  {
    name: 'Dairy',
    description: 'Fresh dairy products',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=200&fit=crop',
    sortOrder: 3
  },
  {
    name: 'Meat & Seafood',
    description: 'Fresh meat and seafood',
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=300&h=200&fit=crop',
    sortOrder: 4
  },
  {
    name: 'Bakery',
    description: 'Fresh baked goods',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=200&fit=crop',
    sortOrder: 5
  },
  {
    name: 'Pantry',
    description: 'Pantry essentials and dry goods',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop',
    sortOrder: 6
  }
];

// This will be populated after categories are created
let products = [];

const createProducts = (categoryIds) => [
  // Fruits
  {
    name: 'Organic Bananas',
    description: 'Fresh organic bananas, perfect for snacking or smoothies. Rich in potassium and natural sugars.',
    price: 2.99,
    originalPrice: 3.49,
    category: categoryIds.fruits,
    images: [
      { url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=300&h=300&fit=crop' }
    ],
    stock: { quantity: 150, unit: 'bunch' },
    specifications: { weight: '1.5 lbs', brand: 'Organic Farm', origin: 'Ecuador' },
    tags: ['organic', 'fresh', 'healthy'],
    isFeatured: true,
    isOnSale: true
  },
  {
    name: 'Red Apples',
    description: 'Crisp and sweet red apples. Great for eating fresh or baking.',
    price: 4.99,
    category: categoryIds.fruits,
    images: [
      { url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop', isPrimary: true }
    ],
    stock: { quantity: 200, unit: 'lb' },
    specifications: { weight: '1 lb', brand: 'Local Farm', origin: 'Washington' },
    tags: ['fresh', 'crisp', 'sweet'],
    isFeatured: true
  },
  {
    name: 'Fresh Strawberries',
    description: 'Sweet and juicy strawberries, perfect for desserts or eating fresh.',
    price: 5.99,
    category: categoryIds.fruits,
    images: [
      { url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300&h=300&fit=crop', isPrimary: true }
    ],
    stock: { quantity: 80, unit: 'pack' },
    specifications: { weight: '1 lb', brand: 'Berry Farm', origin: 'California' },
    tags: ['fresh', 'sweet', 'seasonal']
  },

  // Vegetables
  {
    name: 'Organic Spinach',
    description: 'Fresh organic spinach leaves, perfect for salads and cooking.',
    price: 3.49,
    category: categoryIds.vegetables,
    images: [
      { url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&h=300&fit=crop', isPrimary: true }
    ],
    stock: { quantity: 120, unit: 'bunch' },
    specifications: { weight: '5 oz', brand: 'Green Farms', origin: 'Local' },
    tags: ['organic', 'leafy', 'healthy'],
    isFeatured: true
  },
  {
    name: 'Fresh Carrots',
    description: 'Crunchy and sweet carrots, great for snacking or cooking.',
    price: 2.49,
    category: categoryIds.vegetables,
    images: [
      { url: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=300&h=300&fit=crop', isPrimary: true }
    ],
    stock: { quantity: 180, unit: 'lb' },
    specifications: { weight: '2 lbs', brand: 'Farm Fresh', origin: 'California' },
    tags: ['fresh', 'crunchy', 'healthy']
  },
  {
    name: 'Bell Peppers Mix',
    description: 'Colorful mix of red, yellow, and green bell peppers.',
    price: 4.99,
    category: categoryIds.vegetables,
    images: [
      { url: 'https://images.unsplash.com/photo-1525607551316-4a8e16d1f9ba?w=300&h=300&fit=crop', isPrimary: true }
    ],
    stock: { quantity: 90, unit: 'pack' },
    specifications: { weight: '1.5 lbs', brand: 'Pepper Farm', origin: 'Mexico' },
    tags: ['colorful', 'fresh', 'versatile']
  },

  // Dairy
  {
    name: 'Organic Whole Milk',
    description: 'Fresh organic whole milk from grass-fed cows.',
    price: 4.49,
    category: categoryIds.dairy,
    images: [
      { url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=300&fit=crop', isPrimary: true }
    ],
    stock: { quantity: 60, unit: 'gallon' },
    specifications: { weight: '1 gallon', brand: 'Organic Valley', origin: 'Wisconsin' },
    tags: ['organic', 'fresh', 'whole milk'],
    isFeatured: true
  },
  {
    name: 'Greek Yogurt',
    description: 'Creamy Greek yogurt, high in protein and probiotics.',
    price: 5.99,
    category: categoryIds.dairy,
    images: [
      { url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=300&fit=crop', isPrimary: true }
    ],
    stock: { quantity: 45, unit: 'container' },
    specifications: { weight: '32 oz', brand: 'Chobani', origin: 'New York' },
    tags: ['protein', 'probiotics', 'healthy']
  },

  // Meat & Seafood
  {
    name: 'Fresh Salmon Fillet',
    description: 'Premium Atlantic salmon fillet, rich in omega-3 fatty acids.',
    price: 12.99,
    category: categoryIds.meat,
    images: [
      { url: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=300&h=300&fit=crop', isPrimary: true }
    ],
    stock: { quantity: 25, unit: 'lb' },
    specifications: { weight: '1 lb', brand: 'Ocean Fresh', origin: 'Atlantic' },
    tags: ['fresh', 'omega-3', 'premium'],
    isFeatured: true
  },
  {
    name: 'Organic Chicken Breast',
    description: 'Boneless, skinless organic chicken breast.',
    price: 8.99,
    category: categoryIds.meat,
    images: [
      { url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300&h=300&fit=crop', isPrimary: true }
    ],
    stock: { quantity: 40, unit: 'lb' },
    specifications: { weight: '1 lb', brand: 'Free Range Farm', origin: 'Local' },
    tags: ['organic', 'lean', 'protein']
  },

  // Bakery
  {
    name: 'Artisan Sourdough Bread',
    description: 'Freshly baked artisan sourdough bread with a crispy crust.',
    price: 4.99,
    category: categoryIds.bakery,
    images: [
      { url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop', isPrimary: true }
    ],
    stock: { quantity: 30, unit: 'loaf' },
    specifications: { weight: '1.5 lbs', brand: 'Local Bakery', origin: 'Local' },
    tags: ['artisan', 'sourdough', 'fresh'],
    isFeatured: true
  },
  {
    name: 'Chocolate Croissants',
    description: 'Buttery croissants filled with rich chocolate.',
    price: 6.99,
    category: categoryIds.bakery,
    images: [
      { url: 'https://images.unsplash.com/photo-1555507036-ab794f4ade2a?w=300&h=300&fit=crop', isPrimary: true }
    ],
    stock: { quantity: 24, unit: 'pack' },
    specifications: { weight: '6 pieces', brand: 'French Bakery', origin: 'Local' },
    tags: ['chocolate', 'buttery', 'pastry']
  },

  // Pantry
  {
    name: 'Organic Quinoa',
    description: 'Premium organic quinoa, a complete protein superfood.',
    price: 7.99,
    category: categoryIds.pantry,
    images: [
      { url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop', isPrimary: true }
    ],
    stock: { quantity: 50, unit: 'lb' },
    specifications: { weight: '2 lbs', brand: 'Ancient Harvest', origin: 'Bolivia' },
    tags: ['organic', 'superfood', 'protein'],
    isFeatured: true
  },
  {
    name: 'Extra Virgin Olive Oil',
    description: 'Cold-pressed extra virgin olive oil from Mediterranean olives.',
    price: 12.99,
    category: categoryIds.pantry,
    images: [
      { url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=300&fit=crop', isPrimary: true }
    ],
    stock: { quantity: 35, unit: 'bottle' },
    specifications: { weight: '500ml', brand: 'Mediterranean Gold', origin: 'Italy' },
    tags: ['extra virgin', 'cold-pressed', 'mediterranean']
  }
];

// Import data
const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    console.log('Data Destroyed...'.red.inverse);

    // Create users
    const createdUsers = await User.create(users);
    console.log('Users Imported...'.green.inverse);

    // Create categories
    const createdCategories = await Category.create(categories);
    console.log('Categories Imported...'.green.inverse);

    // Map category names to IDs
    const categoryIds = {
      fruits: createdCategories.find(cat => cat.name === 'Fruits')._id,
      vegetables: createdCategories.find(cat => cat.name === 'Vegetables')._id,
      dairy: createdCategories.find(cat => cat.name === 'Dairy')._id,
      meat: createdCategories.find(cat => cat.name === 'Meat & Seafood')._id,
      bakery: createdCategories.find(cat => cat.name === 'Bakery')._id,
      pantry: createdCategories.find(cat => cat.name === 'Pantry')._id
    };

    // Create products with category IDs
    const productsWithCategories = createProducts(categoryIds);
    await Product.create(productsWithCategories);
    console.log('Products Imported...'.green.inverse);

    // Update category product counts
    for (const category of createdCategories) {
      await category.updateProductCount();
    }
    console.log('Category counts updated...'.green.inverse);

    console.log('Data Import Success!'.green.inverse);
    console.log(`Admin Login: ${process.env.ADMIN_EMAIL || 'admin@egrocery.com'}`.yellow);
    console.log(`Admin Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`.yellow);
    
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`.red.inverse);
    process.exit(1);
  }
};

// Destroy data
const destroyData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}