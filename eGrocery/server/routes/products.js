const express = require('express');
const { body } = require('express-validator');
const {
  getProducts,
  getProduct,
  getFeaturedProducts,
  getSaleProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  getLowStockProducts
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const productValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .isMongoId()
    .withMessage('Please provide a valid category ID'),
  body('stock.quantity')
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a non-negative integer'),
  body('images')
    .isArray({ min: 1 })
    .withMessage('At least one image is required'),
  body('images.*.url')
    .isURL()
    .withMessage('Please provide valid image URLs')
];

const stockUpdateValidation = [
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
  body('operation')
    .optional()
    .isIn(['add', 'subtract'])
    .withMessage('Operation must be either add or subtract')
];

// Public routes
router.get('/featured', getFeaturedProducts);
router.get('/sale', getSaleProducts);
router.get('/', getProducts);
router.get('/:id', getProduct);

// Admin routes
router.get('/admin/low-stock', protect, adminOnly, getLowStockProducts);
router.post('/', protect, adminOnly, productValidation, createProduct);
router.put('/:id', protect, adminOnly, productValidation, updateProduct);
router.put('/:id/stock', protect, adminOnly, stockUpdateValidation, updateStock);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;