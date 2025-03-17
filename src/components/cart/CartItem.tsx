'use client';

import Image from 'next/image';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { CartItem as CartItemType } from '../../types/database.types';
import { formatPrice } from '../../lib/utils';
import { useCart } from '../../context/CartContext';

type CartItemProps = {
  item: CartItemType;
};

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const product = item.product;

  if (!product) {
    return null;
  }

  return (
    <div className="flex py-6 border-b border-gray-200">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <Image
          src={product.image_url}
          alt={product.name}
          width={96}
          height={96}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>{product.name}</h3>
            <p className="ml-4">{formatPrice(product.price * item.quantity)}</p>
          </div>
          <p className="mt-1 text-sm text-gray-500 line-clamp-1">{product.description}</p>
        </div>
        <div className="flex flex-1 items-end justify-between text-sm">
          <div className="flex items-center">
            <button
              type="button"
              className="p-1 text-gray-400 hover:text-gray-500"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              aria-label="Decrease quantity"
            >
              <FiMinus className="h-4 w-4" />
            </button>
            <span className="mx-2 text-gray-700">{item.quantity}</span>
            <button
              type="button"
              className="p-1 text-gray-400 hover:text-gray-500"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              aria-label="Increase quantity"
            >
              <FiPlus className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            className="font-medium text-indigo-600 hover:text-indigo-500"
            onClick={() => removeItem(item.id)}
            aria-label="Remove item"
          >
            <FiTrash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
} 