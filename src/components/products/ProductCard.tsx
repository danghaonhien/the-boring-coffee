'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiShoppingCart, FiCheck } from 'react-icons/fi';
import { Product } from '../../types/database.types';
import { formatPrice } from '../../lib/utils';
import { useCart } from '../../context/CartContext';
import StarRating from './StarRating';
import RoastMeter from './RoastMeter';

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product page
    e.stopPropagation();
    
    addItem(product, 1);
    setIsAdded(true);
    
    // Reset the added state after 1.5 seconds
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  return (
    <div className="group relative bg-[#E8EDDF] rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
      <Link href={`/products/${product.id}`} className="block">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-[#CFDBD5] relative">
          <Image
            src={product.image_url}
            alt={product.name}
            width={500}
            height={500}
            className="w-full h-full object-center object-cover transition-opacity duration-200"
          />
        </div>
        <div className="p-5">
          <h3 className="text-lg font-medium text-[#242423]">{product.name}</h3>
          
          {/* Star Rating */}
          <div className="mt-1 mb-2">
            <StarRating rating={product.rating || 0} />
          </div>
          
          <p className="text-sm text-[#333533] line-clamp-2">{product.description}</p>
          
          {/* Show RoastMeter only for coffee products */}
          {product.category === 'coffee' && product.roastLevel !== undefined && (
            <div className="mt-4">
              <RoastMeter roastLevel={product.roastLevel} showLabels={true} />
            </div>
          )}
          
          <div className="mt-8 flex flex-col space-y-3">
            <p className="text-lg font-medium text-[#242423]">{formatPrice(product.price)}</p>
            
            {/* Add to cart button - moved below price */}
            <button
              onClick={handleAddToCart}
              className="w-full flex justify-center items-center cursor-pointer px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#242423] bg-[#F5CB5C] hover:bg-[#F5CB5C]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F5CB5C] transition-all duration-200 sm:opacity-0 sm:group-hover:opacity-100"
            >
              <span className="flex items-center min-w-[90px] justify-center">
                {isAdded ? (
                  <>
                    <FiCheck className="h-4 w-4 mr-2" />
                    <span>Added!</span>
                  </>
                ) : (
                  <>
                    <FiShoppingCart className="h-4 w-4 mr-2" />
                    <span>Add to Cart</span>
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
} 