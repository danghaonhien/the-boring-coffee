'use client';

import Link from 'next/link';
import { FiShoppingCart, FiUser, FiMenu } from 'react-icons/fi';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-900">The Boring Coffee</span>
            </Link>
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              <Link href="/products" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Shop
              </Link>
              <Link href="/about" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                About
              </Link>
              <Link href="/contact" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Contact
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            <Link href="/cart" className="p-2 text-gray-400 hover:text-gray-500 relative">
              <FiShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-indigo-600 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link href="/account" className="p-2 text-gray-400 hover:text-gray-500 ml-4">
              <FiUser className="h-6 w-6" />
            </Link>
            <button
              type="button"
              className="md:hidden p-2 text-gray-400 hover:text-gray-500 ml-4"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <FiMenu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/products" className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50">
              Shop
            </Link>
            <Link href="/about" className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50">
              About
            </Link>
            <Link href="/contact" className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50">
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
} 