'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Product } from '../../types/database.types';
import { formatPrice } from '../../lib/utils';
import AddToCartButton from './AddToCartButton';

type ProductSliderProps = {
  products: Product[];
};

export default function ProductSlider({ products }: ProductSliderProps) {
  // Make sure lightmode (id=1) is always the first product (left side)
  // and darkmode is always the second product (right side)
  const sortedProducts = [...products].sort((a, b) => {
    // Put lightmode first
    if (a.image_url === 'lightmode') return -1;
    if (b.image_url === 'lightmode') return 1;
    // Then darkmode
    if (a.image_url === 'darkmode') return -1;
    if (b.image_url === 'darkmode') return 1;
    // Then others
    return 0;
  });
  
  // Use only the first two products for comparison
  const limitedProducts = sortedProducts.slice(0, 2);
  
  // Ensure we have the correct products in the correct positions
  const leftProduct = limitedProducts.find(p => p.image_url === 'lightmode') || limitedProducts[0];
  const rightProduct = limitedProducts.find(p => p.image_url === 'darkmode') || limitedProducts[1];
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState(0); // Start at 0% position (first product fully visible)
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleButtonDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault(); // Prevent click events from firing
    setIsDragging(true);
    
    // Add event listeners to window for better drag tracking
    if ('touches' in e) {
      window.addEventListener('touchmove', handleWindowDragMove);
      window.addEventListener('touchend', handleWindowDragEnd);
    } else {
      window.addEventListener('mousemove', handleWindowDragMove);
      window.addEventListener('mouseup', handleWindowDragEnd);
    }
  };

  const handleWindowDragMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging || !imageContainerRef.current) return;
    e.preventDefault();
    
    const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
    const containerWidth = imageContainerRef.current.offsetWidth;
    const containerRect = imageContainerRef.current.getBoundingClientRect();
    
    // Calculate position relative to container
    const relativeX = clientX - containerRect.left;
    const newPosition = Math.max(0, Math.min(100, (relativeX / containerWidth) * 100));
    
    setDragPosition(newPosition);
  };

  const handleWindowDragEnd = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setIsDragging(false);
    
    // Remove event listeners
    window.removeEventListener('mousemove', handleWindowDragMove);
    window.removeEventListener('mouseup', handleWindowDragEnd);
    window.removeEventListener('touchmove', handleWindowDragMove);
    window.removeEventListener('touchend', handleWindowDragEnd);
    
    // Don't switch products when drag ends - keep the products fixed
    // Just keep the visual state based on drag position
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      setDragPosition(Math.min(100, dragPosition + 10));
    } else if (e.key === 'ArrowLeft') {
      setDragPosition(Math.max(0, dragPosition - 10));
    }
  };

  // Determine which product to display based on drag position
  const displayedProduct = dragPosition > 50 ? rightProduct : leftProduct;

  // Get background colors based on product types
  const getProductBackgroundColor = (product: Product) => {
    return product.image_url === 'lightmode' ? '#f8fafc' : 
           product.image_url === 'darkmode' ? '#1e293b' :
           product.image_url === 'function' ? '#475569' :
           product.image_url === 'recursive' ? '#334155' :
           product.image_url === 'boolean' ? '#64748b' :
           product.image_url === 'async' ? '#3b82f6' : '#e2e8f0';
  };
  
  const getProductCupColor = (product: Product) => {
    return product.image_url === 'lightmode' ? '#e2e8f0' : 
           product.image_url === 'darkmode' ? '#0f172a' :
           product.image_url === 'function' ? '#334155' :
           product.image_url === 'recursive' ? '#1e293b' :
           product.image_url === 'boolean' ? '#475569' :
           product.image_url === 'async' ? '#2563eb' : '#cbd5e1';
  };
  
  const isProductDark = (product: Product) => {
    return product.image_url === 'darkmode' || 
           product.image_url === 'recursive' || 
           product.image_url === 'function';
  };

  return (
    <div className="mb-12">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Compare Our Coffee</h3>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Comparison slider - takes 50% width on desktop */}
          <div 
            className="relative md:w-1/2 aspect-square md:aspect-auto"
            tabIndex={0}
            onKeyDown={handleKeyDown}
          >
            {/* Product comparison container */}
            <div 
              ref={imageContainerRef}
              className="relative w-full h-full overflow-hidden"
            >
              {/* Background product (fixed) - right side product */}
              <div 
                className="absolute inset-0 z-10 transition-colors duration-500"
                style={{ 
                  backgroundColor: getProductBackgroundColor(leftProduct)
                }}
              >
                {/* Coffee cup icon */}
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <div className="mb-6 relative">
                    <div 
                      className="w-40 h-40 rounded-full flex items-center justify-center transition-all duration-500"
                      style={{
                        backgroundColor: getProductCupColor(leftProduct),
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      <svg className="w-24 h-24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path 
                          d="M2 8H18V17C18 19.2091 16.2091 21 14 21H6C3.79086 21 2 19.2091 2 17V8Z" 
                          fill={isProductDark(leftProduct) ? 'white' : '#1e293b'} 
                          fillOpacity="0.2"
                        />
                        <path 
                          d="M18 8H2V7C2 4.79086 3.79086 3 6 3H14C16.2091 3 18 4.79086 18 7V8Z" 
                          fill={isProductDark(leftProduct) ? 'white' : '#1e293b'} 
                          fillOpacity="0.4"
                        />
                        <path 
                          d="M18 10H22C22.5523 10 23 10.4477 23 11V13C23 14.6569 21.6569 16 20 16H18V10Z" 
                          fill={isProductDark(leftProduct) ? 'white' : '#1e293b'} 
                          fillOpacity="0.3"
                        />
                        <path 
                          d="M9.5 8C9.5 7.17157 10.1716 6.5 11 6.5H12C12.8284 6.5 13.5 7.17157 13.5 8V8H9.5V8Z" 
                          fill={isProductDark(leftProduct) ? 'white' : '#1e293b'} 
                          fillOpacity="0.5"
                        />
                      </svg>
                    </div>
                    {/* Steam */}
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex space-x-1">
                      <div className="w-1 h-6 bg-white bg-opacity-30 rounded-full animate-steam1"></div>
                      <div className="w-1 h-8 bg-white bg-opacity-30 rounded-full animate-steam2 delay-150"></div>
                      <div className="w-1 h-5 bg-white bg-opacity-30 rounded-full animate-steam3 delay-300"></div>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold transition-colors duration-500 ${isProductDark(leftProduct) ? 'text-white' : 'text-gray-800'}`}>
                    {leftProduct.name}
                  </div>
                </div>
              </div>
              
              {/* Foreground product (revealed with clip-path) - left side product */}
              <div 
                className="absolute inset-0 z-20 transition-all duration-300 ease-out"
                style={{ 
                  backgroundColor: getProductBackgroundColor(leftProduct),
                  clipPath: `polygon(0 0, ${dragPosition}% 0, ${dragPosition}% 100%, 0 100%)`,
                  transition: isDragging ? 'none' : 'clip-path 0.3s ease-out, background-color 0.5s'
                }}
              >
                {/* Coffee cup icon */}
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <div className="mb-6 relative">
                    <div 
                      className="w-40 h-40 rounded-full flex items-center justify-center transition-all duration-500"
                      style={{
                        backgroundColor: getProductCupColor(leftProduct),
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      <svg className="w-24 h-24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path 
                          d="M2 8H18V17C18 19.2091 16.2091 21 14 21H6C3.79086 21 2 19.2091 2 17V8Z" 
                          fill={isProductDark(leftProduct) ? 'white' : '#1e293b'} 
                          fillOpacity="0.2"
                        />
                        <path 
                          d="M18 8H2V7C2 4.79086 3.79086 3 6 3H14C16.2091 3 18 4.79086 18 7V8Z" 
                          fill={isProductDark(leftProduct) ? 'white' : '#1e293b'} 
                          fillOpacity="0.4"
                        />
                        <path 
                          d="M18 10H22C22.5523 10 23 10.4477 23 11V13C23 14.6569 21.6569 16 20 16H18V10Z" 
                          fill={isProductDark(leftProduct) ? 'white' : '#1e293b'} 
                          fillOpacity="0.3"
                        />
                        <path 
                          d="M9.5 8C9.5 7.17157 10.1716 6.5 11 6.5H12C12.8284 6.5 13.5 7.17157 13.5 8V8H9.5V8Z" 
                          fill={isProductDark(leftProduct) ? 'white' : '#1e293b'} 
                          fillOpacity="0.5"
                        />
                      </svg>
                    </div>
                    {/* Steam */}
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex space-x-1">
                      <div className="w-1 h-6 bg-white bg-opacity-30 rounded-full animate-steam1"></div>
                      <div className="w-1 h-8 bg-white bg-opacity-30 rounded-full animate-steam2 delay-150"></div>
                      <div className="w-1 h-5 bg-white bg-opacity-30 rounded-full animate-steam3 delay-300"></div>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold transition-colors duration-500 ${isProductDark(leftProduct) ? 'text-white' : 'text-gray-800'}`}>
                    {leftProduct.name}
                  </div>
                </div>
              </div>
              
              {/* Draggable divider */}
              <div 
                ref={buttonRef}
                className="absolute top-0 bottom-0 w-1 bg-white z-30 cursor-ew-resize"
                style={{ 
                  left: `${dragPosition}%`,
                  transform: 'translateX(-50%)',
                  transition: isDragging ? 'none' : 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onTouchStart={handleButtonDragStart}
                onMouseDown={handleButtonDragStart}
              >
                {/* Drag handle */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center transition-transform duration-200 hover:scale-110">
                  <div className="flex items-center space-x-0">
                    <FiChevronLeft className="h-5 w-5 text-gray-800" />
                    <FiChevronRight className="h-5 w-5 text-gray-800" />
                  </div>
                </div>
              </div>
              
              {/* Progress indicator at bottom */}
              <div className="absolute bottom-4 left-4 right-4 h-1 bg-gray-200 rounded-full overflow-hidden z-30">
                <div 
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${dragPosition}%`,
                    transition: isDragging ? 'none' : 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                />
              </div>
              
              {/* Drag instruction */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white text-xs px-3 py-1 rounded-full">
                Drag to compare
              </div>
            </div>
          </div>
          
          {/* Product info - takes 50% width on desktop */}
          <div className="p-6 md:w-1/2 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 transition-all duration-300">
                    {displayedProduct.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {displayedProduct === rightProduct ? 
                      `Drag left to see ${leftProduct.name}` : 
                      `Drag right to see ${rightProduct.name}`}
                  </p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  New
                </span>
              </div>
              
              <div className="mt-6 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-10 h-10 rounded-full mr-3 transition-all duration-300"
                      style={{
                        backgroundColor: getProductCupColor(displayedProduct)
                      }}
                    ></div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {displayedProduct.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {formatPrice(displayedProduct.price)}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/products/${displayedProduct.id}`}
                    className="text-indigo-600 text-sm font-medium hover:text-indigo-500"
                  >
                    View Details
                  </Link>
                </div>
              </div>
              
              <div className="mt-8 transition-all duration-300">
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600 text-sm">
                  {displayedProduct.description}
                </p>
              </div>
            </div>
            
            <div className="mt-8">
              <AddToCartButton 
                product={displayedProduct} 
                compact={false} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 