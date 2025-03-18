'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '../../types/database.types';
import ProductCard from './ProductCard';
import { FiArrowRight } from 'react-icons/fi';

type CategoryProductGridProps = {
  products: Product[];
  title: string;
  viewAllLink: string;
  initialCount?: number;
};

export default function CategoryProductGrid({ 
  products, 
  title, 
  viewAllLink,
  initialCount = 7 // Default to 7 items (1 featured + 6 regular in first 3 rows)
}: CategoryProductGridProps) {
  const [showMore, setShowMore] = useState(false);
  
  // If no products, don't render anything
  if (!products || products.length === 0) {
    return null;
  }
  
  // Featured product is the first one
  const featuredProduct = products[0];
  
  // The rest of the products
  const restProducts = products.slice(1);
  
  // Determine the number of products to display initially
  const displayProducts = showMore ? restProducts : restProducts.slice(0, initialCount - 1);
  
  const hasMoreProducts = restProducts.length > initialCount - 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-[#CFDBD5]">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-5xl font-display font-bold text-[#242423]">{title}</h2>
        <Link
          href={viewAllLink}
          className="text-[#333533] hover:text-[#242423]/80 flex items-center"
        >
          View All <FiArrowRight className="ml-1" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-12">
        {/* Featured product taking 2 columns */}
        <div className="md:col-span-2 lg:col-span-2">
          <div className="bg-[#E8EDDF] rounded-lg shadow-md overflow-hidden h-full flex flex-col">
            <div className="relative h-80 w-full bg-[#CFDBD5]">
              {featuredProduct.image_url && (
                <Image
                  src={featuredProduct.image_url}
                  alt={featuredProduct.name}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div className="p-6 flex-grow flex flex-col">
              <h3 className="text-xl font-bold text-[#242423]">{featuredProduct.name}</h3>
              <p className="text-[#333533] mt-2 flex-grow">{featuredProduct.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <p className="text-lg font-medium text-[#242423]">${featuredProduct.price.toFixed(2)}</p>
                <Link
                  href={`/products/${featuredProduct.id}`}
                  className="text-[#333533] hover:text-[#242423]/80"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Rest of the products */}
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {/* Show more button */}
      {hasMoreProducts && !showMore && (
        <div className="mt-8 text-center ">
          <button
            onClick={() => setShowMore(true)}
            className="inline-block bg-[#E8EDDF] cursor-pointer border border-[#CFDBD5] rounded-md py-2 px-8 font-medium text-[#242423] hover:bg-[#CFDBD5]"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
} 