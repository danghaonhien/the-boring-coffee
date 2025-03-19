'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { FiShoppingCart, FiMinus, FiPlus, FiCheck } from 'react-icons/fi';
import { Product } from '../../types/database.types';
import { useCart } from '../../context/CartContext';

type AddToCartButtonProps = {
  product: Product;
  compact?: boolean;
};

export default function AddToCartButton({ product, compact = false }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  
  // Keep track of the last click time to debounce
  const lastClickTime = useRef(0);

  // Reset feedback state after delay
  useEffect(() => {
    if (added) {
      const timer = setTimeout(() => {
        setAdded(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [added]);

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  // Use useCallback to memoize the handler
  const handleAddToCart = useCallback(() => {
    // Implement debounce to prevent double clicks
    const now = Date.now();
    if (now - lastClickTime.current < 500) {
      return; // Ignore clicks that happen too quickly
    }
    
    lastClickTime.current = now;
    console.log(`Adding ${quantity} of ${product.name} at ${now}`);
    
    // Add to cart
    addItem(product, quantity);
    setAdded(true);
  }, [addItem, product, quantity]);

  // Use useCallback for the compact version too
  const handleCompactAddToCart = useCallback(() => {
    // Implement debounce to prevent double clicks
    const now = Date.now();
    if (now - lastClickTime.current < 500) {
      return; // Ignore clicks that happen too quickly
    }
    
    lastClickTime.current = now;
    console.log(`Adding 1 of ${product.name} at ${now}`);
    
    // Add to cart
    addItem(product, 1);
    setAdded(true);
  }, [addItem, product]);

  if (compact) {
    return (
    
      <button
        type="button"
        className="w-full flex justify-center items-center px-6 py-3 border cursor-pointer border-transparent rounded-md shadow-sm text-base font-medium text-[#242423] bg-[#F5CB5C] hover:bg-[#F5CB5C]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F5CB5C] transition-colors duration-200"
        onClick={handleCompactAddToCart}
        disabled={added}
      >
        <span className="flex items-center min-w-[120px] justify-center ">
          {added ? (
            <>
              <FiCheck className="h-5 w-5 mr-2" />
              <span>Added!</span>
            </>
          ) : (
            <>
              <FiShoppingCart className="h-5 w-5 mr-2 " />
              <span>Add to Cart</span>
            </>
          )}
        </span>
      </button>
 
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center   w-full sm:w-auto mb-4 sm:mb-0">
          <button
            type="button"
            className="p-2 cursor-pointer rounded-l-md hover:bg-[#CFDBD5]/30 transition-colors duration-200"
            onClick={decreaseQuantity}
            aria-label="Decrease quantity"
            disabled={added}
          >
            <FiMinus className="h-4 w-4 text-[#333533]" />
          </button>
          <span className="flex-1 text-center text-[#242423] font-medium">{quantity}</span>
          <button
            type="button"
            className="p-2 cursor-pointer rounded-r-md hover:bg-[#CFDBD5]/30 transition-colors duration-200 ml-auto"
            onClick={increaseQuantity}
            aria-label="Increase quantity"
            disabled={added}
          >
            <FiPlus className="h-4 w-4 text-[#333533]" />
          </button>
        </div>
        <button
          type="button"
          className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-[#242423] bg-[#F5CB5C] hover:bg-[#F5CB5C]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F5CB5C] transition-colors duration-200"
          onClick={handleAddToCart}
          disabled={added}
        >
          <span className="flex items-center justify-center">
            {added ? (
              <>
                <FiCheck className="h-5 w-5 mr-2" />
                <span>Added to Cart!</span>
              </>
            ) : (
              <>
                <FiShoppingCart className="h-5 w-5 mr-2" />
                <span>Add to Cart</span>
              </>
            )}
          </span>
        </button>
      </div>
    </div>
  );
} 