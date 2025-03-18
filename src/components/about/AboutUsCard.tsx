'use client';

import Image from 'next/image';
import { FiPlus } from 'react-icons/fi';
import { useState } from 'react';
import Modal from './Modal';

export interface AboutUsCardProps {
  title: string;
  subtitle: string;
  image: string;
  content: React.ReactNode;
  previewText?: string;
  backgroundColor?: string;
  textColor?: string;
}

export default function AboutUsCard({
  title,
  subtitle,
  image,
  content,
  previewText = "Click to learn more about our story...",
  backgroundColor = '#242423',
  textColor = '#E8EDDF'
}: AboutUsCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div 
        className="relative overflow-hidden rounded-xl shadow-lg h-100 group cursor-pointer"
        style={{ backgroundColor }}
        onClick={() => setIsModalOpen(true)}
      >
        {/* Full bleed background image */}
        <div className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-110">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-all duration-700"
            priority
          />
          {/* Gradient overlay */}
          <div 
            className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60 transition-opacity duration-500" 
            style={{ backgroundColor: `${backgroundColor}70` }}
          />
        </div>
        
        {/* Card content */}
        <div className="relative z-10 p-6 flex flex-col h-full">
          <div className="mb-auto">
            <h3 className="text-lg font-medium mb-1" style={{ color: textColor }}>
              {title}
            </h3>
            <h2 className="text-3xl font-bold leading-tight" style={{ color: textColor }}>
              {subtitle}
            </h2>
          </div>

          {/* Preview text that appears on hover */}
          <div className="mt-4 opacity-0 max-h-0 group-hover:max-h-24 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
            <p className="text-sm" style={{ color: textColor }}>
              {previewText}
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className="absolute bottom-4 right-4 bg-[#F5CB5C] bg-opacity-70 rounded-full p-2 cursor-pointer backdrop-blur-sm transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
            aria-label={`Learn more about ${title}`}
          >
            <FiPlus className="h-6 w-6 text-[#333533]" />
          </button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
      >
        <div>
          <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold text-[#242423] mb-4">{subtitle}</h2>
          <div className="prose prose-lg max-w-none text-[#333533]">
            {content}
          </div>
        </div>
      </Modal>
    </>
  );
} 