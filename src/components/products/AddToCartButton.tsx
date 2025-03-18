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
        className={`w-full ${added ? 'bg-[#333533]' : 'bg-[#F5CB5C]'} border border-transparent rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium ${added ? 'text-[#E8EDDF]' : 'text-[#242423]'} hover:${added ? 'bg-[#242423]' : 'bg-[#CFDBD5]'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F5CB5C] transition-colors duration-200`}
        onClick={handleCompactAddToCart}
        disabled={added}
      >
        {added ? (
          <>
            <FiCheck className="h-4 w-4 mr-2" />
            Added!
          </>
        ) : (
          <>
            <FiShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </>
        )}
      </button>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-4">
        <button
          type="button"
          className="p-2 border border-[#CFDBD5] rounded-md hover:bg-[#E8EDDF] transition-colors duration-200"
          onClick={decreaseQuantity}
          aria-label="Decrease quantity"
          disabled={added}
        >
          <FiMinus className="h-4 w-4 text-[#333533]" />
        </button>
        <span className="mx-4 text-[#242423] font-medium">{quantity}</span>
        <button
          type="button"
          className="p-2 border border-[#CFDBD5] rounded-md hover:bg-[#E8EDDF] transition-colors duration-200"
          onClick={increaseQuantity}
          aria-label="Increase quantity"
          disabled={added}
        >
          <FiPlus className="h-4 w-4 text-[#333533]" />
        </button>
      </div>
      <button
        type="button"
        className={`w-full ${added ? 'bg-[#333533]' : 'bg-[#F5CB5C]'} border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium ${added ? 'text-[#E8EDDF]' : 'text-[#242423]'} hover:${added ? 'bg-[#242423]' : 'bg-[#CFDBD5]'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F5CB5C] transition-colors duration-200`}
        onClick={handleAddToCart}
        disabled={added}
      >
        {added ? (
          <>
            <FiCheck className="h-5 w-5 mr-2" />
            Added to Cart!
          </>
        ) : (
          <>
            <FiShoppingCart className="h-5 w-5 mr-2" />
            Add to Cart
          </>
        )}
      </button>
    </div>
  );
} 