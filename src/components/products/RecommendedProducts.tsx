'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Product } from '../../types/database.types';
import { formatPrice } from '../../lib/utils';
import { useCart } from '../../context/CartContext';

interface RecommendedProductsProps {
  currentProductId: string;
  products: Product[];
  title?: string;
}

export default function RecommendedProducts({ 
  currentProductId, 
  products,
  title = "You Might Also Like"
}: RecommendedProductsProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();
  
  // Filter out the current product
  const recommendedProducts = products
    .filter(product => product.id !== currentProductId)
    .slice(0, 7); // Show up to 7 products
  
  if (recommendedProducts.length === 0) {
    return null;
  }
  
  const scrollToSlide = (slide: number) => {
    if (sliderRef.current) {
      const itemWidth = 220; // Item width + margin (smaller)
      const totalSlides = recommendedProducts.length;
      
      // Normalize slide index for looping
      let targetSlide = slide;
      if (targetSlide < 0) targetSlide = totalSlides - 1;
      if (targetSlide >= totalSlides) targetSlide = 0;
      
      // Scroll to the target slide
      sliderRef.current.scrollTo({
        left: targetSlide * itemWidth,
        behavior: 'smooth'
      });
      
      setCurrentSlide(targetSlide);
    }
  };
  
  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#242423]">{title}</h2>
        
        {recommendedProducts.length > 1 && (
          <div className="flex gap-1">
            <button 
              onClick={() => scrollToSlide(currentSlide - 1)}
              className="p-1.5 rounded-full bg-[#CFDBD5] text-[#242423]"
              aria-label="Previous product"
            >
              <FiChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={() => scrollToSlide(currentSlide + 1)}
              className="p-1.5 rounded-full bg-[#CFDBD5] text-[#242423]"
              aria-label="Next product"
            >
              <FiChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
      
      <div className="relative overflow-hidden">
        <div 
          ref={sliderRef}
          className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            scrollSnapType: 'x mandatory'
          }}
        >
          <style jsx global>{`
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
            
            @media (min-width: 640px) {
              .product-card {
                width: calc(50% - 1rem);
                flex: 0 0 calc(50% - 1rem);
              }
            }
            
            @media (min-width: 768px) {
              .product-card {
                width: calc(33.333% - 1rem);
                flex: 0 0 calc(33.333% - 1rem);
              }
            }
            
            @media (min-width: 1024px) {
              .product-card {
                width: calc(25% - 1rem);
                flex: 0 0 calc(25% - 1rem);
              }
            }
          `}</style>
          
          {recommendedProducts.map((product) => (
            <div 
              key={product.id} 
              className="product-card relative flex-shrink-0 w-[200px] snap-start"
            >
              <div className="bg-[#E8EDDF] shadow-sm overflow-hidden h-full flex flex-col transition-opacity hover:opacity-90 relative">
                <Link href={`/products/${product.id}`} className="block">
                  <div className="aspect-square bg-[#CFDBD5] overflow-hidden">
                    {product.image_url && (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        width={200}
                        height={200}
                        className="w-full h-full object-center object-cover"
                        unoptimized
                      />
                    )}
                  </div>
                </Link>
                
                <div className="p-3 flex flex-col h-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-md font-medium text-[#242423] truncate max-w-[120px]">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-sm text-[#333533]">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                    <button
                      onClick={() => addItem(product, 1)}
                      className="w-8 h-8 rounded-sm bg-[#F5CB5C] text-[#242423] flex items-center justify-center align-middle cursor-pointer hover:bg-[#F5CB5C]/90"
                      aria-label={`Add ${product.name} to cart`}
                    >
                      <span className="text-xl font-medium leading-none flex items-center justify-center">+</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 