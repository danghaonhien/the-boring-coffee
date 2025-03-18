'use client';

import { useState, useEffect } from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import CartModal from './CartModal';
import { products } from '../../data/products';
import { Product } from '../../types/database.types';

export default function CartButton() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const { items, totalItems } = useCart();

  // Get recommended products based on cart items
  useEffect(() => {
    if (items.length === 0) {
      // If cart is empty, show popular products
      setRecommendedProducts(products.slice(0, 4));
    } else {
      // Get categories of items in cart
      const cartCategories = new Set(
        items
          .map(item => item.product?.category)
          .filter(Boolean) as string[]
      );
      
      // Find products in the same categories that aren't in the cart
      const cartProductIds = new Set(items.map(item => item.product_id));
      const recommended = products
        .filter(product => 
          !cartProductIds.has(product.id) && 
          product.category && 
          cartCategories.has(product.category)
        )
        .slice(0, 4);
      
      setRecommendedProducts(recommended.length > 0 ? recommended : products.slice(0, 4));
    }
  }, [items]);

  return (
    <>
      <button
        onClick={() => setIsCartOpen(true)}
        className="relative p-2 text-gray-600 hover:text-amber-700 transition-colors"
        aria-label="Open shopping cart"
      >
        <FiShoppingCart className="h-6 w-6" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs text-white bg-amber-700 rounded-full">
            {totalItems}
          </span>
        )}
      </button>
      
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        recommendedProducts={recommendedProducts}
      />
    </>
  );
} 