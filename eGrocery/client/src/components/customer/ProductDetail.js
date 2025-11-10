import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useCart } from '../../context/CartContext';
import LoadingSpinner from '../common/LoadingSpinner';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, getItemQuantity } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${id}`);
      setProduct(response.data.data);
    } catch (err) {
      setError('Product not found');
      console.error('Product fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    // Show success message or redirect to cart
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock.quantity) {
      setQuantity(newQuantity);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getDiscountedPrice = () => {
    if (product.discount > 0) {
      return product.price * (1 - product.discount / 100);
    }
    return product.price;
  };

  const getStockStatus = () => {
    if (product.stock.quantity === 0) return { text: 'Out of Stock', color: 'text-red-600' };
    if (product.stock.quantity < 10) return { text: 'Low Stock', color: 'text-orange-600' };
    return { text: 'In Stock', color: 'text-green-600' };
  };

  if (loading) {
    return <LoadingSpinner message="Loading product details..." />;
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/products')}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const stockStatus = getStockStatus();
  const discountedPrice = getDiscountedPrice();
  const cartQuantity = getItemQuantity(product._id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <button
                onClick={() => navigate('/')}
                className="text-gray-700 hover:text-green-600"
              >
                Home
              </button>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <button
                  onClick={() => navigate('/products')}
                  className="ml-1 text-gray-700 hover:text-green-600 md:ml-2"
                >
                  Products
                </button>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-1 text-gray-500 md:ml-2">{product.name}</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={product.images?.[selectedImage] || product.image || 'https://via.placeholder.com/500x500?text=No+Image'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/500x500?text=No+Image';
                  }}
                />
              </div>
              
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? 'border-green-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < Math.floor(product.rating?.average || 0) ? 'fill-current' : 'text-gray-300'}`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">
                      ({product.rating?.average || 0}) • {product.rating?.count || 0} reviews
                    </span>
                  </div>
                  <span className={`text-sm font-semibold ${stockStatus.color}`}>
                    {stockStatus.text}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold text-green-600">
                    {formatPrice(discountedPrice)}
                  </span>
                  {product.discount > 0 && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        {formatPrice(product.price)}
                      </span>
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-md text-sm font-semibold">
                        -{product.discount}% OFF
                      </span>
                    </>
                  )}
                </div>
                <p className="text-gray-600">per {product.unit}</p>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-200">
                <div>
                  <span className="text-sm text-gray-500">Category</span>
                  <p className="font-medium">{product.category?.name || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Stock</span>
                  <p className="font-medium">{product.stock.quantity} units</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Unit</span>
                  <p className="font-medium">{product.unit}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">SKU</span>
                  <p className="font-medium">{product.sku || 'N/A'}</p>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700">Quantity:</label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stock.quantity}
                      className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.stock.quantity} available
                  </span>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock.quantity === 0}
                    className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
                      product.stock.quantity === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {product.stock.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                  
                  {cartQuantity > 0 && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>In cart: {cartQuantity}</span>
                      <button
                        onClick={() => navigate('/cart')}
                        className="text-green-600 hover:text-green-700 font-medium"
                      >
                        View Cart
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;