'use client';

import { useState, useEffect } from 'react';
import { FiCoffee } from 'react-icons/fi';

type PromoBannerProps = {
  messages?: string[];
};

export default function PromoBanner({ messages = [
  "Free shipping on all orders over $50!",
  "New customers get 10% off with code WELCOME10",
  "Limited time: Try our new seasonal blends!",
] }: PromoBannerProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Rotate through messages every 5 seconds
  useEffect(() => {
    if (messages.length <= 1) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
        setIsAnimating(false);
      }, 500); // Wait for fade out animation before changing text
    }, 5000);

    return () => clearInterval(interval);
  }, [messages]);

  return (
    <div className="bg-[#242423] text-[#E8EDDF] py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-[24px]">
          <FiCoffee className="h-4 w-4 text-[#F5CB5C] mr-2" aria-hidden="true" />
          <div className="relative overflow-hidden h-6 inline-block">
            <p 
              className={`text-sm font-medium transition-opacity duration-300 ${
                isAnimating ? 'opacity-0' : 'opacity-100'
              }`}
            >
              {messages[currentMessageIndex]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 