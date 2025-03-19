'use client';

import { useState, useEffect } from 'react';
import { FiArrowUp } from 'react-icons/fi';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      // Show button when user scrolls down more than half the viewport height
      const scrollY = window.scrollY;
      const halfViewport = window.innerHeight / 2;
      
      if (scrollY > halfViewport) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-20 right-6 p-3 cursor-pointer rounded-full bg-[#F5CB5C] text-[#242423] shadow-md transition-all duration-300 z-40 hover:bg-[#F5CB5C]/80 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
      aria-label="Scroll to top"
    >
      <FiArrowUp className="h-5 w-5" />
    </button>
  );
} 