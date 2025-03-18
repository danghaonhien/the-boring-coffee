'use client';

import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FiX, FiMail, FiCheck } from 'react-icons/fi';
import Image from 'next/image';

export default function NewsletterModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Show modal after 15 seconds of page load
  useEffect(() => {
    // Check if user has already seen the modal
    const hasSeenModal = localStorage.getItem('newsletter_modal_seen');
    
    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 15000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Handle close modal
  const closeModal = () => {
    setIsOpen(false);
    // Set flag in localStorage so we don't show it again in this session
    localStorage.setItem('newsletter_modal_seen', 'true');
  };

  // Handle submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      
      // Save discount code to localStorage
      localStorage.setItem('discount_code', 'WELCOME15');
      
      // Close modal after 3 seconds
      setTimeout(() => {
        closeModal();
      }, 3000);
    }, 1500);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed z-50 inset-0 overflow-y-auto" onClose={closeModal}>
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-[#242423] opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-[#E8EDDF] rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="absolute top-0 right-0 pt-4 pr-4 z-10">
                <button
                  type="button"
                  className="bg-transparent cursor-pointer rounded-md text-[#333533] hover:text-[#242423] focus:outline-none"
                  onClick={closeModal}
                >
                  <span className="sr-only">Close</span>
                  <FiX className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              
              <div className="flex">
                <div className="w-full sm:w-3/5 hidden sm:block">
                  <div className="relative h-full w-full">
                    <Image 
                      src="/images/darkmode.jpg" 
                      alt="Coffee beans"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 600px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#242423]/70 to-transparent"></div>
                    
                    {/* Overlay text on image */}
                    <div className="absolute top-0 left-0 p-10 w-full h-full flex flex-col justify-center text-white">
                      <h2 className="text-3xl font-bold mb-4">
                        Join Our <span className="text-[#F5CB5C]">Coffee</span> Club
                      </h2>
                      <p className="text-sm text-[#E8EDDF] mb-2 max-w-xs">
                        Receive expert brewing tips, new product announcements, and exclusive deals.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="w-full sm:w-2/5 p-6 sm:p-8">
                  <div className="text-center sm:text-left">
                    {/* Mobile only title */}
                    <h2 className="text-2xl font-bold mb-3 text-[#242423] block sm:hidden">
                      Join Our <span className="text-[#F5CB5C]">Coffee</span> Club
                    </h2>
                    
                    <Dialog.Title as="h3" className="text-xl sm:text-2xl font-bold leading-6 text-[#242423]">
                      Get 15% Off Your First Order
                    </Dialog.Title>
                    <div className="mt-3">
                      <p className="text-sm text-[#333533]">
                        Subscribe to our newsletter for exclusive offers and brewing tips.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    {!isSubmitted ? (
                      <form onSubmit={handleSubmit} className="space-y-4 min-h-[180px]">
                        <div>
                          <label htmlFor="email" className="sr-only">
                            Email address
                          </label>
                          <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiMail className="h-4 w-4 text-[#333533]" aria-hidden="true" />
                            </div>
                            <input
                              type="email"
                              name="email"
                              id="email"
                              className="block w-full pl-9 pr-3 py-2 text-sm border border-[#CFDBD5] rounded-md bg-white focus:outline-none focus:ring-[#F5CB5C] focus:border-[#F5CB5C]"
                              placeholder="Enter your email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center cursor-pointer px-5 py-2 text-sm border border-transparent rounded-md shadow-sm font-medium text-[#242423] bg-[#F5CB5C] hover:bg-[#F5CB5C]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F5CB5C] transition-colors duration-200 disabled:opacity-50"
                          >
                            {isLoading ? 'Subscribing...' : 'Get 15% Off'}
                          </button>
                        </div>
                        <p className="text-xs text-center text-[#333533] mt-4">
                          By subscribing, you agree to receive marketing emails from us. 
                          Your discount code will be sent to your email.
                        </p>
                      </form>
                    ) : (
                      <div className="text-center py-4 min-h-[180px] flex flex-col justify-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[#F5CB5C]/20 mb-4">
                          <FiCheck className="h-6 w-6 text-[#F5CB5C]" aria-hidden="true" />
                        </div>
                        <h3 className="text-lg font-medium text-[#242423] mb-2">Thank You!</h3>
                        <p className="text-sm text-[#333533]">
                          Your discount code is: <span className="font-bold">WELCOME15</span>
                        </p>
                        <p className="text-xs text-[#333533] mt-2">
                          We&apos;ve also sent this to your email.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 