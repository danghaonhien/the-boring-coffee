'use client';

import { useState, useEffect } from 'react';

type PromoBannerProps = {
  messages?: string[];
};

export default function PromoBanner({ messages = [
  "Free shipping on orders over $50!",
  "New customers get 10% off with code WELCOME10",
  "Limited time offer: Buy one get one 50% off!",
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
    <div className="bg-indigo-600 text-white py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center relative overflow-hidden h-6">
          <p 
            className={`text-sm font-medium transition-all duration-500 absolute left-0 right-0 ${
              isAnimating ? 'opacity-0 -translate-y-6' : 'opacity-100 translate-y-0'
            }`}
          >
            {messages[currentMessageIndex]}
          </p>
        </div>
      </div>
      
      {/* Add keyframes for additional animations if needed */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
} 