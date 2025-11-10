import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  return (
    <Link 
      to={`/products?category=${category._id}`}
      className="group block"
    >
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative">
          <img
            src={category.image || 'https://via.placeholder.com/300x200?text=No+Image'}
            alt={category.name}
            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
        </div>
        
        <div className="p-4 text-center">
          <h3 className="font-semibold text-lg text-gray-800 group-hover:text-green-600 transition-colors">
            {category.name}
          </h3>
          {category.description && (
            <p className="text-gray-600 text-sm mt-1">
              {category.description}
            </p>
          )}
          <div className="mt-2 text-green-600 font-medium group-hover:underline">
            Shop Now →
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;