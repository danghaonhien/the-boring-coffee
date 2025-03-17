'use client';

import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import CartItem from '../../components/cart/CartItem';
import { formatPrice } from '../../lib/utils';

export default function CartPage() {
  const { items, subtotal, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <p className="text-gray-500 mb-6">Your cart is empty</p>
          <Link
            href="/products"
            className="inline-block bg-indigo-600 border border-transparent rounded-md py-3 px-8 font-medium text-white hover:bg-indigo-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Items ({totalItems})
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {items.map((item) => (
                <div key={item.id} className="p-6">
                  <CartItem item={item} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
            <div className="flex justify-between py-2">
              <p className="text-gray-500">Subtotal</p>
              <p className="text-gray-900 font-medium">{formatPrice(subtotal)}</p>
            </div>
            <div className="flex justify-between py-2">
              <p className="text-gray-500">Shipping</p>
              <p className="text-gray-900 font-medium">Calculated at checkout</p>
            </div>
            <div className="flex justify-between py-2">
              <p className="text-gray-500">Tax</p>
              <p className="text-gray-900 font-medium">Calculated at checkout</p>
            </div>
            <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between">
              <p className="text-lg font-medium text-gray-900">Total</p>
              <p className="text-lg font-medium text-gray-900">{formatPrice(subtotal)}</p>
            </div>
            <div className="mt-6">
              <Link
                href="/checkout"
                className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Proceed to Checkout
              </Link>
            </div>
            <div className="mt-4">
              <Link
                href="/products"
                className="w-full bg-white border border-gray-300 rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 