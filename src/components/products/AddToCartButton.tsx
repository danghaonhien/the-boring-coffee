'use client';

import { useState } from 'react';
import { FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi';
import { Product } from '../../types/database.types';
import { useCart } from '../../context/CartContext';

type AddToCartButtonProps = {
  product: Product;
  compact?: boolean;
};

export default function AddToCartButton({ product, compact = false }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    setQuantity(1);
  };

  if (compact) {
    return (
      <button
        type="button"
        className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={() => addItem(product, 1)}
      >
        <FiShoppingCart className="h-4 w-4 mr-2" />
        Add to Cart
      </button>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-4">
        <button
          type="button"
          className="p-2 border border-gray-300 rounded-md"
          onClick={decreaseQuantity}
          aria-label="Decrease quantity"
        >
          <FiMinus className="h-4 w-4" />
        </button>
        <span className="mx-4 text-gray-900">{quantity}</span>
        <button
          type="button"
          className="p-2 border border-gray-300 rounded-md"
          onClick={increaseQuantity}
          aria-label="Increase quantity"
        >
          <FiPlus className="h-4 w-4" />
        </button>
      </div>
      <button
        type="button"
        className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={handleAddToCart}
      >
        <FiShoppingCart className="h-5 w-5 mr-2" />
        Add to Cart
      </button>
    </div>
  );
} 