'use client';

import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle escape key press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
      onTransitionEnd={() => {
        if (!isOpen) setIsAnimating(false);
      }}
    >
      <div className="fixed inset-0 bg-black opacity-60 backdrop-blur-sm" />
      
      <div 
        className={`relative bg-[#E8EDDF] rounded-xl shadow-xl max-w-2xl w-full mx-auto overflow-hidden transition-all duration-300 transform ${isOpen ? 'scale-100' : 'scale-95'}`}
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex items-center justify-between p-6 border-b border-[#CFDBD5]">
          <h3 className="text-2xl font-bold text-[#242423]">{title}</h3>
          <button 
            className="rounded-full p-2 hover:bg-[#CFDBD5] transition-colors duration-200"
            onClick={onClose}
            aria-label="Close modal"
          >
            <FiX className="w-6 h-6 text-[#333533]" />
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
} 