'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
// import { FiShoppingCart } from 'react-icons/fi';
import { Product } from '../../types/database.types';
import { formatPrice } from '../../lib/utils';
import { useCart } from '../../context/CartContext';
import AddToCartButton from './AddToCartButton';
import CartModal from '../cart/CartModal';
import { products } from '../../data/products';

interface StickyProductFooterProps {
  product: Product;
}

export default function StickyProductFooter({ product }: StickyProductFooterProps) {
  const { items } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  
  // Check if product is in cart
  useEffect(() => {
    const productInCart = items.some(item => item.product_id === product.id);
    setIsInCart(productInCart);
  }, [items, product.id]);
  
  // Get recommended products for the cart modal
  useEffect(() => {
    // Get categories of the current product
    const productCategory = product.category;
    
    // Find products in the same category that aren't the current product
    const recommended = products
      .filter(p => 
        p.id !== product.id && 
        p.category === productCategory
      )
      .slice(0, 4);
    
    // Fallback to popular products if no similar products found
    setRecommendedProducts(recommended.length > 0 ? recommended : products.slice(0, 4));
  }, [product]);
  
  useEffect(() => {
    const handleScroll = () => {
      // Show the footer when the user scrolls down more than half the viewport height
      const scrollY = window.scrollY;
      const halfViewport = window.innerHeight / 2;
      
      if (scrollY > halfViewport) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <>
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-[#E8EDDF] border-t border-[#CFDBD5] py-3 px-4 z-50 transition-transform duration-300 ${
          isVisible ? 'translate-y-0 shadow-lg' : 'translate-y-full'
        }`}
        style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0))' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between sm:justify-end gap-x-6">
            <div className="flex items-center space-x-3 gap-x-1">
              {/* Product Image */}
              <div className="relative h-12 w-12 rounded-md overflow-hidden bg-[#CFDBD5] flex-shrink-0">
                {product.image_url && (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                    unoptimized
                  />
                )}
              </div>
              
              {/* Product Name & Price */}
              <div className="flex flex-col ">
                <h3 className="text-lg font-medium text-[#242423] truncate max-w-[150px] sm:max-w-none">
                  {product.name}
                </h3>
                {product.original_price && product.discount_percentage ? (
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-coffee-700">
                      {formatPrice(product.price)}
                    </p>
                    <p className="text-xs line-through text-coffee-400">
                      {formatPrice(product.original_price)}
                    </p>
                    <span className="bg-coffee-700 text-white text-xs px-1.5 py-0.5 rounded">
                      {product.discount_percentage}% OFF
                    </span>
                  </div>
                ) : (
                  <p className="text-sm font-medium text-[#333533]">
                    {formatPrice(product.price)}
                  </p>
                )}
              </div>
            </div>
            
            <div className="w-40 sm:w-48">
              {isInCart ? (
                <button
                  type="button"
                  className="w-full flex justify-center items-center px-4 py-2 cursor-pointer border border-transparent rounded-md shadow-sm text-base font-medium text-[#242423] bg-[#F5CB5C] hover:bg-[#F5CB5C]/90 focus:outline-none transition-colors duration-200"
                  onClick={() => setIsCartOpen(true)}
                >
                  <span className="flex items-center justify-center">
                    {/* <FiShoppingCart className="h-5 w-5 mr-2" /> */}
                    <span>Continue</span>
                  </span>
                </button>
              ) : (
                <AddToCartButton product={product} compact={true} />
              )}
            </div>
          </div>
        </div>
      </div>
      
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        recommendedProducts={recommendedProducts}
      />
    </>
  );
} 