'use client';

import { useState, useEffect } from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import CartModal from './CartModal';
import { Product } from '../../types/database.types';
import { getRecommendedProducts } from '../../lib/api/products';

export default function CartButton() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { items, totalItems } = useCart();

  // Get recommended products based on cart items
  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      setIsLoading(true);
      try {
        if (items.length === 0) {
          // If cart is empty, show popular products (first 4)
          const allProducts = await getRecommendedProducts('', 4);
          setRecommendedProducts(allProducts);
        } else {
          // Get the first product ID to exclude
          const firstItemId = items[0]?.product_id || '';
          
          // Use recommended products API to get products
          const recommended = await getRecommendedProducts(firstItemId, 4);
          setRecommendedProducts(recommended);
        }
      } catch (error) {
        console.error('Error fetching recommended products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendedProducts();
  }, [items]);

  return (
    <>
      <button
        onClick={() => setIsCartOpen(true)}
        className="relative p-2 text-[#333533] hover:text-[#333533] transition-colors cursor-pointer"
        aria-label="Open shopping cart"
      >
        <FiShoppingCart className="h-6 w-6" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs text-[#E8EDDF] bg-[#333533] rounded-full">
            {totalItems}
          </span>
        )}
      </button>
      
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        recommendedProducts={recommendedProducts}
        isLoading={isLoading}
      />
    </>
  );
} 