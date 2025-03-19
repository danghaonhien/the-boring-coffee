'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface ProductImageSliderProps {
  images: string[];
  productName: string;
}

export default function ProductImageSlider({ images, productName }: ProductImageSliderProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // If there are no images, show a placeholder
  if (!images || images.length === 0) {
    return (
      <div className="aspect-w-1 aspect-h-1 bg-[#CFDBD5] rounded-lg overflow-hidden">
        <div className="flex items-center justify-center h-full">
          <p className="text-[#333533]">No image available</p>
        </div>
      </div>
    );
  }
  
  const goToPrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  
  return (
    <div>
      {/* Main image with navigation arrows */}
      <div className="relative aspect-w-1 aspect-h-1 bg-[#CFDBD5] rounded-lg overflow-hidden mb-4">
        <Image
          src={images[currentImageIndex]}
          alt={`${productName} - Image ${currentImageIndex + 1}`}
          width={600}
          height={600}
          className="w-full h-full object-center object-cover"
          priority
        />
        
        {/* Navigation arrows - only show if there's more than one image */}
        {images.length > 1 && (
          <>
            {/* Previous button */}
            <button 
              onClick={goToPrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#242423]/60 text-white p-2 rounded-full hover:bg-[#242423]/80 transition-colors focus:outline-none focus:ring-2 focus:ring-[#F5CB5C]"
              aria-label="Previous image"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            
            {/* Next button */}
            <button 
              onClick={goToNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#242423]/60 text-white p-2 rounded-full hover:bg-[#242423]/80 transition-colors focus:outline-none focus:ring-2 focus:ring-[#F5CB5C]"
              aria-label="Next image"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
            
            {/* Pagination indicator */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center">
              <div className="bg-[#242423]/60 px-3 py-1 rounded-full text-sm text-white">
                {currentImageIndex + 1} / {images.length}
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`aspect-w-1 aspect-h-1 bg-[#CFDBD5] rounded-md overflow-hidden border-2 transition-colors ${
                currentImageIndex === index ? 'border-[#F5CB5C]' : 'border-transparent hover:border-[#CFDBD5]'
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${productName} - Thumbnail ${index + 1}`}
                width={150}
                height={150}
                className={`w-full h-full object-center object-cover transition-opacity ${
                  currentImageIndex === index ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 