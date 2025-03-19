'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import AddToCartButton from './AddToCartButton';
import { Product } from '../../types/database.types';
import { formatPrice } from '../../lib/utils';

interface StickyProductFooterProps {
  product: Product;
}

export default function StickyProductFooter({ product }: StickyProductFooterProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      // Show the footer when the user scrolls down more than half the viewport height
      const scrollY = window.scrollY;
      const halfViewport = window.innerHeight / 2;
      
      if (scrollY > halfViewport) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 bg-[#E8EDDF] border-t border-[#CFDBD5] py-3 px-4 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0 shadow-lg' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0))' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between sm:justify-end gap-x-6">
          <div className="flex items-center space-x-3 gap-x-1">
            {/* Product Image */}
            <div className="relative h-12 w-12 rounded-md overflow-hidden bg-[#CFDBD5] flex-shrink-0">
              {product.image_url && (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                  unoptimized
                />
              )}
            </div>
            
            {/* Product Name & Price */}
            <div className="flex flex-col ">
              <h3 className="text-lg font-medium text-[#242423] truncate max-w-[150px] sm:max-w-none">
                {product.name}
              </h3>
              <p className="text-sm font-medium text-[#333533]">
                {formatPrice(product.price)}
              </p>
            </div>
          </div>
          
          <div className="w-40 sm:w-48">
            <AddToCartButton product={product} compact={true} />
          </div>
        </div>
      </div>
    </div>
  );
} 