import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getItemPrice = (item) => {
    const product = item.product;
    return product.discount > 0 
      ? product.price * (1 - product.discount / 100)
      : product.price;
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link
              to="/products"
              className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  Cart Items ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {items.map((item) => {
                  const product = item.product;
                  const itemPrice = getItemPrice(item);
                  
                  return (
                    <div key={product._id} className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <img
                            src={product.image || 'https://via.placeholder.com/100x100?text=No+Image'}
                            alt={product.name}
                            className="w-20 h-20 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                            }}
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/product/${product._id}`}
                            className="text-lg font-semibold text-gray-900 hover:text-green-600"
                          >
                            {product.name}
                          </Link>
                          <p className="text-gray-600 text-sm mt-1">
                            {product.description?.substring(0, 100)}...
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-lg font-bold text-green-600">
                              {formatPrice(itemPrice)}
                            </span>
                            {product.discount > 0 && (
                              <span className="text-sm text-gray-500 line-through">
                                {formatPrice(product.price)}
                              </span>
                            )}
                            <span className="text-sm text-gray-500">per {product.unit}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => handleQuantityChange(product._id, item.quantity - 1)}
                              className="px-3 py-2 text-gray-600 hover:text-gray-800"
                            >
                              -
                            </button>
                            <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(product._id, item.quantity + 1)}
                              disabled={item.quantity >= product.stock}
                              className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                            >
                              +
                            </button>
                          </div>
                          
                          {/* Item Total */}
                          <div className="text-right min-w-[5rem]">
                            <div className="text-lg font-bold text-gray-900">
                              {formatPrice(itemPrice * item.quantity)}
                            </div>
                          </div>
                          
                          {/* Remove Button */}
                          <button
                            onClick={() => removeFromCart(product._id)}
                            className="text-red-500 hover:text-red-700 p-2"
                            title="Remove from cart"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      {/* Stock Warning */}
                      {product.stock < 10 && (
                        <div className="mt-3 text-sm text-orange-600">
                          Only {product.stock} left in stock
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                  <span className="font-semibold">{formatPrice(totalPrice)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">{formatPrice(totalPrice * 0.08)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-green-600">{formatPrice(totalPrice * 1.08)}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors mb-4"
              >
                Proceed to Checkout
              </button>
              
              <Link
                to="/products"
                className="block w-full text-center bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Continue Shopping
              </Link>
              
              {/* Delivery Info */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2 text-green-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold">Fast Delivery</span>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  Order within 2 hours for same-day delivery
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;