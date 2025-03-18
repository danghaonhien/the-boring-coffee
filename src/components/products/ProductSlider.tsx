'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Product } from '../../types/database.types';
import { formatPrice } from '../../lib/utils';
import AddToCartButton from './AddToCartButton';

type ProductSliderProps = {
  products: Product[];
};

export default function ProductSlider({ products }: ProductSliderProps) {
  // Manually select the products for the slider positions
  // Find products
  const lightProduct = products.find(p => p.name.toLowerCase() === 'lightmode') || products[0];
  const darkProduct = products.find(p => p.name.toLowerCase() === 'darkmode') || products[products.length > 1 ? 1 : 0];
  
  // Left side is Lightmode, right side is Darkmode
  const leftProduct = lightProduct;
  const rightProduct = darkProduct;
  
  const [isDragging, setIsDragging] = useState(false);
  // Start at 50% position showing both products equally
  const [dragPosition, setDragPosition] = useState(50); 
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
  // The visual representation works as follows:
  // - When drag position is between 0-50%, more of the left product (lightmode) is visible
  // - When drag position is >50%, more of the right product (darkmode) is visible
  // Since we use clip-path with "polygon(0 0, ${dragPosition}% 0, ${dragPosition}% 100%, 0 100%)"
  // for leftProduct, smaller dragPosition means less leftProduct is shown (more rightProduct visible)
  const displayedProduct = dragPosition <= 50 ? rightProduct : leftProduct;

  return (
    <div className="mb-12">
      {/* <h3 className="text-xl font-bold text-[#242423] mb-4">Compare Our Coffee</h3> */}
      
      <div className="bg-[#E8EDDF] rounded-lg shadow-md overflow-hidden">
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
              >
                {/* Product Image */}
                <div className="w-full h-full relative">
                  {rightProduct.image_url && (
                    <Image 
                      src={rightProduct.image_url} 
                      alt={rightProduct.name}
                      fill
                      className="object-cover"
                    />
                  )}
                  
                  {/* Product name overlay - simplified */}
                  <div className="absolute bottom-0  inset-x-0 bg-gradient-to-t from-[#242423] to-transparent py-4 px-4">
                    <div className="text-2xl font-bold text-[#E8EDDF] text-right">
                      {rightProduct.name}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Foreground product (revealed with clip-path) - left side product */}
              <div 
                className="absolute inset-0 z-20 transition-all duration-300 ease-out"
                style={{ 
                  clipPath: `polygon(0 0, ${dragPosition}% 0, ${dragPosition}% 100%, 0 100%)`,
                  transition: isDragging ? 'none' : 'clip-path 0.3s ease-out, background-color 0.5s'
                }}
              >
                {/* Product Image */}
                <div className="w-full h-full relative">
                  {leftProduct.image_url && (
                    <Image 
                      src={leftProduct.image_url} 
                      alt={leftProduct.name}
                      fill
                      className="object-cover"
                    />
                  )}
                  
                  {/* Product name overlay - simplified */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#242423] to-transparent py-4 px-4">
                    <div className="text-2xl font-bold text-[#E8EDDF]">
                      {leftProduct.name}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Draggable divider */}
              <div 
                ref={buttonRef}
                className="absolute top-0 bottom-0 w-1 bg-[#E8EDDF] z-30 cursor-ew-resize"
                style={{ 
                  left: `${dragPosition}%`,
                  transform: 'translateX(-50%)',
                  transition: isDragging ? 'none' : 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onTouchStart={handleButtonDragStart}
                onMouseDown={handleButtonDragStart}
              >
                {/* Drag handle */}
                <div 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-transparent rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110"
                >
                  <div className="flex items-center space-x-0">
                    <FiChevronLeft className="h-7 w-7 text-[#E8EDDF]" />
                    <FiChevronRight className="h-7 w-7 text-[#E8EDDF]" />
                  </div>
                </div>
              </div>
              
              {/* Progress indicator at bottom */}
              <div className="absolute bottom-4 left-4 right-4 h-1 bg-[#CFDBD5] rounded-full overflow-hidden z-30">
                <div 
                  className="h-full bg-[#F5CB5C] rounded-full transition-all duration-300"
                  style={{ 
                    width: `${dragPosition}%`,
                    transition: isDragging ? 'none' : 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                />
              </div>
              
              {/* Drag instruction */}
              {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-[#242423] bg-opacity-50 text-[#E8EDDF] text-xs px-3 py-1 rounded-full">
                Drag to compare
              </div> */}
            </div>
          </div>
          
          {/* Product info - takes 50% width on desktop */}
          <div className="p-6 md:w-1/2 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-[#242423] transition-all duration-300">
                    {displayedProduct.name}
                  </h3>
                  {/* <p className="text-sm text-[#333533] mt-1">
                    {displayedProduct === rightProduct ? 
                      `Drag left to see ${leftProduct.name}` : 
                      `Drag right to see ${rightProduct.name}`}
                  </p> */}
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F5CB5C] text-[#242423]">
                  New
                </span>
              </div>
              
              <div className="mt-6 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-10 h-10 rounded-full mr-3 bg-[#CFDBD5] transition-all duration-300"
                    ></div>
                    <div>
                      <h4 className="font-medium text-[#242423]">
                        {displayedProduct.name}
                      </h4>
                      <p className="text-sm text-[#333533]">
                        {formatPrice(displayedProduct.price)}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/products/${displayedProduct.id}`}
                    className="text-[#333533] text-sm font-medium hover:text-[#242423]"
                  >
                    View Details
                  </Link>
                </div>
              </div>
              
              <div className="mt-8 transition-all duration-300">
                <h4 className="font-medium text-[#242423] mb-2">Description</h4>
                <p className="text-[#333533] text-sm">
                  {displayedProduct.description}
                </p>
              </div>
            </div>
            
            <div className="mt-8 ">
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