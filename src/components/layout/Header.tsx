'use client';

import Link from 'next/link';
import { FiUser, FiMenu, FiCoffee } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import CartButton from '../cart/CartButton';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll to determine if we should add shadow
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Initial check
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Cleanup event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header 
      className={`bg-white ${
        isScrolled 
          ? 'shadow-md border-b-0 py-2' 
          : 'shadow-sm border-b border-amber-200 py-4'
      } sticky top-0 z-50 transition-all duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center space-x-2">
              <FiCoffee className="h-8 w-8 text-amber-700" />
              <span className="font-display text-3xl font-bold text-gray-900 tracking-tight">
                The <span className="text-amber-700">Boring</span> Coffee
              </span>
            </Link>
            <nav className="hidden md:ml-8 md:flex md:space-x-8">
              <Link 
                href="/products" 
                className="text-gray-700 hover:text-amber-700 px-3 py-2 text-base font-medium font-sans transition-colors duration-200"
              >
                Shop
              </Link>
              <Link 
                href="/about" 
                className="text-gray-700 hover:text-amber-700 px-3 py-2 text-base font-medium font-sans transition-colors duration-200"
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-700 hover:text-amber-700 px-3 py-2 text-base font-medium font-sans transition-colors duration-200"
              >
                Contact
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            <CartButton />
            <Link 
              href="/account" 
              className="p-2 text-gray-700 hover:text-amber-700 ml-4 transition-colors duration-200"
            >
              <FiUser className="h-7 w-7" />
            </Link>
            <button
              type="button"
              className="md:hidden p-2 text-gray-700 hover:text-amber-700 ml-4 transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <FiMenu className="h-7 w-7" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1 border-t border-amber-100">
            <Link 
              href="/products" 
              className="block pl-4 pr-4 py-3 text-base font-medium text-gray-700 hover:text-amber-700 hover:bg-amber-100"
            >
              Shop
            </Link>
            <Link 
              href="/about" 
              className="block pl-4 pr-4 py-3 text-base font-medium text-gray-700 hover:text-amber-700 hover:bg-amber-100"
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="block pl-4 pr-4 py-3 text-base font-medium text-gray-700 hover:text-amber-700 hover:bg-amber-100"
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
} 