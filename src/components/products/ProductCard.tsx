'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiShoppingCart, FiCheck } from 'react-icons/fi';
import { Product } from '../../types/database.types';
import { formatPrice } from '../../lib/utils';
import { useCart } from '../../context/CartContext';

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
    <div className="group relative bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
      <Link href={`/products/${product.id}`} className="block">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200 relative">
          <Image
            src={product.image_url}
            alt={product.name}
            width={500}
            height={500}
            className="w-full h-full object-center object-cover transition-opacity duration-200"
          />
        </div>
        <div className="p-5">
          <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
          <p className="mt-2 text-sm text-gray-500 line-clamp-2">{product.description}</p>
          
          <div className="mt-4 flex items-center justify-between">
            <p className="text-lg font-medium text-gray-900">{formatPrice(product.price)}</p>
            
            {/* Add to cart button - only visible on hover on desktop, always visible on mobile */}
            <button
              onClick={handleAddToCart}
              className={`${
                isAdded ? 'bg-green-600' : 'bg-amber-700'
              } text-white px-3 py-2 text-sm shadow-sm transition-all duration-200 rounded-sm flex items-center cursor-pointer sm:opacity-0 sm:group-hover:opacity-100`}
            >
              {isAdded ? (
                <>
                  <FiCheck className="mr-1 h-3 w-3" />
                  Added
                </>
              ) : (
                <>
                  <FiShoppingCart className="mr-1 h-3 w-3" />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
} 