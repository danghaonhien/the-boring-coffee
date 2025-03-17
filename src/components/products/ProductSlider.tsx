'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Product } from '../../types/database.types';
import { formatPrice } from '../../lib/utils';
import AddToCartButton from './AddToCartButton';

type ProductSliderProps = {
  products: Product[];
};

export default function ProductSlider({ products }: ProductSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState(0); // 0-100% position
  const [lastDragX, setLastDragX] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Set next index when current index changes
  useEffect(() => {
    setNextIndex((currentIndex + 1) % products.length);
  }, [currentIndex, products.length]);

  // Handle switching to next product when dragged all the way
  useEffect(() => {
    if (dragPosition >= 100) {
      setCurrentIndex(nextIndex);
      setDragPosition(0);
    }
  }, [dragPosition, nextIndex]);

  const handleButtonDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    
    // Store the starting X position
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setLastDragX(clientX);
  };

  const handleButtonDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || !imageContainerRef.current) return;
    e.stopPropagation();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const containerWidth = imageContainerRef.current.offsetWidth;
    
    // Calculate the drag distance as a percentage of container width
    const dragDistance = clientX - lastDragX;
    const dragPercent = (dragDistance / containerWidth) * 100 * 50; // 5x sensitivity
    
    // Update the drag position with enhanced sensitivity
    const newPosition = Math.max(0, Math.min(100, dragPosition + dragPercent));
    setDragPosition(newPosition);
    setLastDragX(clientX);
    
    // If position crosses 50%, update next index
    if (newPosition > 50 && dragPosition <= 50) {
      setNextIndex((currentIndex + 1) % products.length);
    } else if (newPosition <= 50 && dragPosition > 50) {
      setNextIndex(currentIndex === 0 ? products.length - 1 : currentIndex - 1);
    }
  };

  const handleButtonDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
  };

  const handleSwitchProduct = () => {
    setCurrentIndex(nextIndex);
    setDragPosition(0);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      setDragPosition(Math.min(100, dragPosition + 20)); // Increased sensitivity
    } else if (e.key === 'ArrowLeft') {
      setDragPosition(Math.max(0, dragPosition - 20)); // Increased sensitivity
    }
  };

  // Handle direct click on the image container
  const handleImageContainerClick = (e: React.MouseEvent) => {
    if (!imageContainerRef.current) return;
    
    const containerRect = imageContainerRef.current.getBoundingClientRect();
    const clickX = e.clientX - containerRect.left;
    const containerWidth = containerRect.width;
    
    // Calculate position as percentage
    const clickPosition = (clickX / containerWidth) * 100;
    setDragPosition(clickPosition);
  };

  const currentProduct = products[currentIndex];
  const nextProduct = products[nextIndex];

  return (
    <div 
      className="relative overflow-hidden bg-white rounded-lg shadow-md"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div 
        ref={sliderRef}
        className="relative w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div 
            ref={imageContainerRef}
            className="relative aspect-square bg-gray-100 overflow-hidden cursor-pointer"
            onClick={handleImageContainerClick}
          >
            {/* Current product image */}
            <div 
              className="absolute inset-0 transition-transform duration-300 ease-out"
              style={{ 
                transform: `translateX(-${dragPosition}%)`,
                opacity: 1 - (dragPosition / 100)
              }}
            >
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <div className="text-2xl font-bold text-gray-500">{currentProduct.name}</div>
              </div>
            </div>
            
            {/* Next product image (revealed when dragging) */}
            <div 
              className="absolute inset-0 transition-transform duration-300 ease-out"
              style={{ 
                transform: `translateX(${100 - dragPosition}%)`,
                opacity: dragPosition / 100
              }}
            >
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <div className="text-2xl font-bold text-white">{nextProduct.name}</div>
              </div>
            </div>
            
            {/* Draggable divider with arrows */}
            <div 
              ref={buttonRef}
              className="absolute top-0 bottom-0 w-16 flex items-center justify-center cursor-grab active:cursor-grabbing z-10 transition-all duration-200"
              style={{ 
                left: `${dragPosition}%`,
                transform: `translateX(-50%)`,
              }}
              onTouchStart={handleButtonDragStart}
              onTouchMove={handleButtonDragMove}
              onTouchEnd={handleButtonDragEnd}
              onMouseDown={handleButtonDragStart}
              onMouseMove={handleButtonDragMove}
              onMouseUp={handleButtonDragEnd}
              onMouseLeave={handleButtonDragEnd}
            >
              {/* Vertical divider line */}
              <div className="absolute inset-y-0 w-px bg-white bg-opacity-70"></div>
              
              {/* Drag handle */}
              <div className="absolute bg-white rounded-full p-3 shadow-md">
                <div className="flex items-center space-x-1">
                  <FiChevronLeft className="h-5 w-5 text-gray-800" />
                  <FiChevronRight className="h-5 w-5 text-gray-800" />
                </div>
              </div>
            </div>
            
            {/* Drag guides */}
            <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white to-transparent opacity-20 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white to-transparent opacity-20 pointer-events-none"></div>
            
            {/* Complete reveal button - appears when dragged far enough */}
            {dragPosition > 20 && (
              <button
                className="absolute bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-opacity duration-300"
                style={{ opacity: (dragPosition - 20) / 30 }}
                onClick={handleSwitchProduct}
              >
                Switch to {nextProduct.name}
              </button>
            )}
            
            {/* Drag instruction - fades out as you drag */}
            <div 
              className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white text-xs px-3 py-1 rounded-full transition-opacity duration-300"
              style={{ opacity: 1 - (dragPosition / 30) }}
            >
              Drag to reveal
            </div>
          </div>
          
          <div className="p-8 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-900">{currentProduct.name}</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  New
                </span>
              </div>
              <p className="text-lg font-medium text-gray-900 mb-4">{formatPrice(currentProduct.price)}</p>
              <p className="text-gray-600 mb-6">{currentProduct.description}</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-center items-center">
                <div className="flex space-x-1">
                  {products.map((_, index) => (
                    <span 
                      key={index}
                      className={`block h-1.5 rounded-full ${
                        index === currentIndex ? 'w-6 bg-indigo-600' : 'w-2 bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Link
                  href={`/products/${currentProduct.id}`}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-md text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  View Details
                </Link>
                <div className="flex-1">
                  <AddToCartButton product={currentProduct} compact={true} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 