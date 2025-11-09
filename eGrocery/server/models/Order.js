const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: String,
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unit: {
    type: String,
    default: 'piece'
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  shippingAddress: {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: 'USA'
    }
  },
  paymentInfo: {
    method: {
      type: String,
      enum: ['cash_on_delivery', 'credit_card', 'debit_card', 'paypal', 'stripe'],
      default: 'cash_on_delivery'
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date
  },
  pricing: {
    itemsPrice: {
      type: Number,
      required: true,
      min: 0
    },
    taxPrice: {
      type: Number,
      default: 0,
      min: 0
    },
    shippingPrice: {
      type: Number,
      default: 0,
      min: 0
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String
  }],
  deliveryInfo: {
    estimatedDelivery: Date,
    actualDelivery: Date,
    trackingNumber: String,
    deliveryInstructions: String
  },
  notes: String,
  isGift: {
    type: Boolean,
    default: false
  },
  giftMessage: String,
  couponCode: String,
  refundInfo: {
    reason: String,
    amount: Number,
    processedAt: Date,
    refundId: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

// Add status to history when status changes
orderSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date()
    });
  }
  next();
});

// Virtual for total items count
orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for order age in days
orderSchema.virtual('orderAge').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for current status info
orderSchema.virtual('currentStatusInfo').get(function() {
  const statusMap = {
    pending: { color: 'yellow', message: 'Order is pending confirmation' },
    confirmed: { color: 'blue', message: 'Order confirmed and being prepared' },
    processing: { color: 'orange', message: 'Order is being processed' },
    shipped: { color: 'purple', message: 'Order has been shipped' },
    delivered: { color: 'green', message: 'Order delivered successfully' },
    cancelled: { color: 'red', message: 'Order has been cancelled' },
    refunded: { color: 'gray', message: 'Order has been refunded' }
  };
  return statusMap[this.status] || { color: 'gray', message: 'Unknown status' };
});

// Index for efficient queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ 'paymentInfo.status': 1 });

// Static method to get orders by status
orderSchema.statics.getOrdersByStatus = function(status, limit = 50) {
  return this.find({ status })
    .populate('user', 'name email')
    .populate('items.product', 'name images')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get recent orders
orderSchema.statics.getRecentOrders = function(limit = 10) {
  return this.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get sales analytics
orderSchema.statics.getSalesAnalytics = async function(startDate, endDate) {
  const pipeline = [
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        status: { $in: ['delivered', 'shipped'] }
      }
    },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$pricing.totalPrice' },
        averageOrderValue: { $avg: '$pricing.totalPrice' },
        totalItems: { $sum: { $sum: '$items.quantity' } }
      }
    }
  ];
  
  const result = await this.aggregate(pipeline);
  return result[0] || {
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    totalItems: 0
  };
};

// Method to update status with history
orderSchema.methods.updateStatus = function(newStatus, note = '') {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    note
  });
  return this.save();
};

// Method to calculate delivery estimate
orderSchema.methods.calculateDeliveryEstimate = function() {
  const businessDays = 3; // Default 3 business days
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + businessDays);
  this.deliveryInfo.estimatedDelivery = deliveryDate;
  return this.save();
};

// Method to process refund
orderSchema.methods.processRefund = function(reason, amount) {
  this.status = 'refunded';
  this.refundInfo = {
    reason,
    amount: amount || this.pricing.totalPrice,
    processedAt: new Date(),
    refundId: `REF-${Date.now()}`
  };
  return this.save();
};

module.exports = mongoose.model('Order', orderSchema);