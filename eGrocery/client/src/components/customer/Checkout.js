import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderData, setOrderData] = useState({
    shippingAddress: {
      fullName: user?.name || '',
      email: user?.email || '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    },
    paymentMethod: 'card',
    deliveryOption: 'standard'
  });

  const handleInputChange = (section, field, value) => {
    setOrderData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderItems = items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.discount > 0 
          ? item.product.price * (1 - item.product.discount / 100)
          : item.product.price
      }));

      const orderPayload = {
        items: orderItems,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        deliveryOption: orderData.deliveryOption,
        totalAmount: totalPrice * 1.08, // Including tax
        tax: totalPrice * 0.08,
        subtotal: totalPrice
      };

      const response = await api.post('/orders', orderPayload);
      
      if (response.data.success) {
        clearCart();
        navigate(`/order-confirmation/${response.data.data._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to checkout</p>
          <button
            onClick={() => navigate('/login', { state: { from: '/checkout' } })}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Add some items to your cart before checkout</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
          >
            Shop Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Shipping Address</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={orderData.shippingAddress.fullName}
                      onChange={(e) => handleInputChange('shippingAddress', 'fullName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={orderData.shippingAddress.email}
                      onChange={(e) => handleInputChange('shippingAddress', 'email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={orderData.shippingAddress.phone}
                      onChange={(e) => handleInputChange('shippingAddress', 'phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={orderData.shippingAddress.address}
                      onChange={(e) => handleInputChange('shippingAddress', 'address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={orderData.shippingAddress.city}
                      onChange={(e) => handleInputChange('shippingAddress', 'city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={orderData.shippingAddress.state}
                      onChange={(e) => handleInputChange('shippingAddress', 'state', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={orderData.shippingAddress.zipCode}
                      onChange={(e) => handleInputChange('shippingAddress', 'zipCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Options */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Delivery Options</h2>
                
                <div className="space-y-3">
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="deliveryOption"
                      value="standard"
                      checked={orderData.deliveryOption === 'standard'}
                      onChange={(e) => setOrderData(prev => ({ ...prev, deliveryOption: e.target.value }))}
                      className="text-green-500 focus:ring-green-500"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium">Standard Delivery</span>
                        <span className="text-green-600 font-semibold">Free</span>
                      </div>
                      <p className="text-sm text-gray-600">2-3 business days</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="deliveryOption"
                      value="express"
                      checked={orderData.deliveryOption === 'express'}
                      onChange={(e) => setOrderData(prev => ({ ...prev, deliveryOption: e.target.value }))}
                      className="text-green-500 focus:ring-green-500"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium">Express Delivery</span>
                        <span className="font-semibold">$9.99</span>
                      </div>
                      <p className="text-sm text-gray-600">Same day delivery</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Payment Method</h2>
                
                <div className="space-y-3">
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={orderData.paymentMethod === 'card'}
                      onChange={(e) => setOrderData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                      className="text-green-500 focus:ring-green-500"
                    />
                    <div className="ml-3">
                      <span className="font-medium">Credit/Debit Card</span>
                      <p className="text-sm text-gray-600">Visa, Mastercard, American Express</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={orderData.paymentMethod === 'paypal'}
                      onChange={(e) => setOrderData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                      className="text-green-500 focus:ring-green-500"
                    />
                    <div className="ml-3">
                      <span className="font-medium">PayPal</span>
                      <p className="text-sm text-gray-600">Pay with your PayPal account</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={orderData.paymentMethod === 'cod'}
                      onChange={(e) => setOrderData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                      className="text-green-500 focus:ring-green-500"
                    />
                    <div className="ml-3">
                      <span className="font-medium">Cash on Delivery</span>
                      <p className="text-sm text-gray-600">Pay when you receive your order</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
                
                {/* Order Items */}
                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                  {items.map((item) => {
                    const itemPrice = getItemPrice(item);
                    return (
                      <div key={item.product._id} className="flex items-center space-x-3">
                          <img
                          src={item.product.image || 'https://via.placeholder.com/50x50?text=No+Image'}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.quantity} × {formatPrice(itemPrice)}
                          </p>
                        </div>
                        <span className="text-sm font-medium">
                          {formatPrice(itemPrice * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                {/* Pricing */}
                <div className="space-y-3 border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">{formatPrice(totalPrice)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-green-600">
                      {orderData.deliveryOption === 'express' ? '$9.99' : 'Free'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold">{formatPrice(totalPrice * 0.08)}</span>
                  </div>
                  
                  <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
                    <span>Total</span>
                    <span className="text-green-600">
                      {formatPrice(totalPrice * 1.08 + (orderData.deliveryOption === 'express' ? 9.99 : 0))}
                    </span>
                  </div>
                </div>
                
                {error && (
                  <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;