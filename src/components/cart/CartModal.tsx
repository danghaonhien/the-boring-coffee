'use client';

import { useEffect, Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Dialog, Transition } from '@headlessui/react';
import { FiX, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../lib/utils';
import { Product } from '../../types/database.types';

type CartModalProps = {
  isOpen: boolean;
  onClose: () => void;
  recommendedProducts: Product[];
};

export default function CartModal({ isOpen, onClose, recommendedProducts }: CartModalProps) {
  const { items, removeItem, updateQuantity, subtotal, addItem, totalItems } = useCart();

  // Close cart when pressing escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Lock body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handler for adding a recommended product to cart
  const handleAddRecommended = (product: Product) => {
    addItem(product, 1);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 overflow-hidden z-50" onClose={onClose}>
        <div className="absolute inset-0 overflow-hidden">
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="absolute inset-0 bg-[#242423] opacity-50 backdrop-blur-sm transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-y-0 right-0 max-w-full flex">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-300"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-300"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="w-screen max-w-md">
                <div className="h-full flex flex-col bg-[#E8EDDF] shadow-xl overflow-hidden">
                  {/* Header */}
                  <div className="px-4 py-5 bg-[#242423] text-[#E8EDDF] flex items-center justify-between">
                    <Dialog.Title className="text-lg font-medium">
                      Your Cart ({totalItems})
                    </Dialog.Title>
                    <button
                      type="button"
                      className="rounded-md text-[#E8EDDF] hover:text-[#F5CB5C]"
                      onClick={onClose}
                    >
                      <span className="sr-only">Close panel</span>
                      <FiX className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  
                               {/* Free shipping banner */}
                  {items.length > 0 && (
                    <div className="bg-[#E8EDDF] px-4 py-3 h-[64px] flex items-center">
                      {subtotal >= 5000 ? (
                        <div className="text-center w-full animate-fadeIn">
                          <p className="text-sm text-[#333533] animate-bounce">
                            🎉 Woohoo! You have unlocked free shipping!
                          </p>
                        </div>
                      ) : (
                        <div className="w-full">
                          <div className="flex justify-between text-xs text-[#333533] mb-2">
                            <span>Add {formatPrice(5000 - subtotal)} more to get free shipping!</span>
                            <span>{formatPrice(subtotal)} of {formatPrice(5000)}</span>
                          </div>
                          <div className="h-2 w-full bg-[#CFDBD5] rounded-full overflow-hidden">
                            <div 
                              className="h-2 bg-[#F5CB5C] rounded-full transition-all duration-700 ease-out"
                              style={{ width: `${Math.min(100, (subtotal / 5000) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Cart items */}
                  <div className="flex-1 overflow-y-auto py-4">
                    {items.length > 0 ? (
                      <ul className="divide-y divide-[#CFDBD5] px-4">
                        {items.map((item) => (
                          <li key={item.id} className="py-6 flex">
                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-[#CFDBD5]">
                              {item.product?.image_url && (
                                <Image
                                  src={item.product.image_url}
                                  alt={item.product.name}
                                  width={96}
                                  height={96}
                                  className="h-full w-full object-cover object-center"
                                />
                              )}
                            </div>

                            <div className="ml-4 flex flex-1 flex-col">
                              <div>
                                <div className="flex justify-between">
                                  <div>
                                    <h3 className="text-base font-medium text-[#242423]">
                                      {item.product?.name}
                                    </h3>
                            
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeItem(item.id)}
                                    className="text-[#333533] hover:text-[#242423]"
                                    aria-label="Remove item"
                                  >
                                    <FiX className="h-5 w-5" />
                                  </button>
                                </div>
                              </div>
                              <div className="mt-auto flex items-end justify-between text-sm">
                                <div className="flex items-center ">
                                  <button
                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                    className="p-2 text-[#333533] hover:bg-[#CFDBD5]"
                                    aria-label="Decrease quantity"
                                  >
                                    <FiMinus className="h-3 w-3" />
                                  </button>
                                  <span className="px-3 py-1">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="p-2 text-[#333533] hover:bg-[#CFDBD5]"
                                    aria-label="Increase quantity"
                                  >
                                    <FiPlus className="h-3 w-3" />
                                  </button>
                                </div>
                                <p className="font-medium text-[#242423]">{formatPrice(item.product?.price || 0)}</p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-10 px-4">
                        <FiShoppingBag className="mx-auto h-12 w-12 text-[#333533]" />
                        <h3 className="mt-2 text-lg font-medium text-[#242423]">Your cart is empty</h3>
                        <p className="mt-1 text-sm text-[#333533]">
                          Start adding products to your cart to see them here.
                        </p>
                        <div className="mt-6">
                          <button
                            onClick={onClose}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#242423] bg-[#F5CB5C] hover:bg-[#F5CB5C]/90"
                          >
                            Continue Shopping
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Recommended products */}
                  {items.length > 0 && recommendedProducts.length > 0 && (
                    <div className="px-4 py-4 border-t border-[#CFDBD5]">
                      <h2 className="text-base font-medium text-[#242423] mb-4">You might also like</h2>
                      <div className="grid grid-cols-2 gap-4">
                        {recommendedProducts.slice(0, 2).map((product) => (
                          <div key={product.id} className="relative group">
                            <div className="w-full aspect-w-1 aspect-h-1 bg-[#CFDBD5] rounded-md overflow-hidden">
                              {product.image_url && (
                                <Image
                                  src={product.image_url}
                                  alt={product.name}
                                  width={200}
                                  height={200}
                                  className="w-full h-full object-center object-cover group-hover:opacity-75"
                                />
                              )}
                            </div>
                            <div className="mt-2">
                              <h3 className="text-sm text-[#333533] truncate">
                                {product.name}
                              </h3>
                              <div className="flex justify-between items-center mt-1">
                                <p className="text-sm font-medium text-[#242423]">{formatPrice(product.price)}</p>
                                <button
                                  className="px-2 py-1 text-xs font-medium rounded bg-[#F5CB5C] text-[#242423] opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => handleAddRecommended(product)}
                                  aria-label={`Add ${product.name} to cart`}
                                >
                                  Add
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Checkout section */}
                  {items.length > 0 && (
                    <div className="border-t border-[#CFDBD5] px-4 py-5">
                      <div className="flex justify-between font-medium text-base mb-3">
                        <p>Subtotal:</p>
                        <p>{formatPrice(subtotal)}</p>
                      </div>
                      <p className="text-xs text-[#333533] mb-4">Shipping and taxes calculated at checkout.</p>
                      <Link
                        href="/checkout"
                        className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-[#242423] bg-[#F5CB5C] hover:bg-[#F5CB5C]/90"
                        onClick={onClose}
                      >
                        CHECKOUT
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 