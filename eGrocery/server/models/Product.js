const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a product price'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'Please provide a category']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  stock: {
    quantity: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    lowStockThreshold: {
      type: Number,
      default: 10
    },
    unit: {
      type: String,
      enum: ['piece', 'kg', 'gram', 'liter', 'ml', 'dozen', 'pack'],
      default: 'piece'
    }
  },
  specifications: {
    weight: String,
    dimensions: String,
    brand: String,
    origin: String,
    expiryDate: Date,
    nutritionalInfo: {
      calories: Number,
      protein: String,
      carbs: String,
      fat: String,
      fiber: String
    }
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  soldCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create slug from name before saving
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Virtual for low stock status
productSchema.virtual('isLowStock').get(function() {
  return this.stock.quantity <= this.stock.lowStockThreshold;
});

// Virtual for out of stock status
productSchema.virtual('isOutOfStock').get(function() {
  return this.stock.quantity === 0;
});

// Virtual for primary image
productSchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary ? primary.url : (this.images[0] ? this.images[0].url : 'https://via.placeholder.com/300x300?text=No+Image');
});

// Index for search functionality
productSchema.index({
  name: 'text',
  description: 'text',
  tags: 'text'
});

// Index for filtering and sorting
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ soldCount: -1 });
productSchema.index({ createdAt: -1 });

// Static method to get featured products
productSchema.statics.getFeaturedProducts = function(limit = 8) {
  return this.find({ isFeatured: true, isActive: true })
    .populate('category', 'name slug')
    .sort({ soldCount: -1, 'rating.average': -1 })
    .limit(limit);
};

// Static method to get products on sale
productSchema.statics.getSaleProducts = function(limit = 12) {
  return this.find({ isOnSale: true, isActive: true })
    .populate('category', 'name slug')
    .sort({ discountPercentage: -1 })
    .limit(limit);
};

// Static method to get low stock products
productSchema.statics.getLowStockProducts = function() {
  return this.find({
    isActive: true,
    $expr: { $lte: ['$stock.quantity', '$stock.lowStockThreshold'] }
  }).populate('category', 'name');
};

// Method to update stock
productSchema.methods.updateStock = function(quantity, operation = 'subtract') {
  if (operation === 'subtract') {
    this.stock.quantity = Math.max(0, this.stock.quantity - quantity);
  } else if (operation === 'add') {
    this.stock.quantity += quantity;
  }
  return this.save();
};

// Method to increment view count
productSchema.methods.incrementViewCount = function() {
  this.viewCount += 1;
  return this.save({ validateBeforeSave: false });
};

// Method to update rating
productSchema.methods.updateRating = function(newRating) {
  const totalRating = (this.rating.average * this.rating.count) + newRating;
  this.rating.count += 1;
  this.rating.average = totalRating / this.rating.count;
  return this.save({ validateBeforeSave: false });
};

module.exports = mongoose.model('Product', productSchema);