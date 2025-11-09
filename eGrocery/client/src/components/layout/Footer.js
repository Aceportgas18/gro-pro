import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiPackage, FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi';

const Footer = () => {
  const location = useLocation();

  // Don't show footer on admin pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-primary-600 text-white p-2 rounded-lg">
                <FiPackage className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold">eGrocery</span>
            </div>
            <p className="text-gray-300 text-sm">
              Your trusted online grocery store delivering fresh, quality products right to your doorstep.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                <FiFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                <FiTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                <FiInstagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Cart
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=fruits" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Fruits
                </Link>
              </li>
              <li>
                <Link to="/products?category=vegetables" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Vegetables
                </Link>
              </li>
              <li>
                <Link to="/products?category=dairy" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Dairy
                </Link>
              </li>
              <li>
                <Link to="/products?category=meat" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Meat & Seafood
                </Link>
              </li>
              <li>
                <Link to="/products?category=bakery" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Bakery
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FiMapPin className="h-4 w-4 text-primary-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  123 Grocery Street, Food City, FC 12345
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <FiPhone className="h-4 w-4 text-primary-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  +1 (555) 123-4567
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <FiMail className="h-4 w-4 text-primary-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  support@egrocery.com
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © 2024 eGrocery. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;