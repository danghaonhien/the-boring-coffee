'use client';

import Image from 'next/image';
import { FaStar } from 'react-icons/fa';

export interface ReviewCardProps {
  productName: string;
  productDescription: string;
  reviewerName: string;
  date: string;
  verified?: boolean;
  rating: number;
  productImage?: string;
}

export default function ReviewCard({
  productName,
  productDescription,
  reviewerName,
  date,
  verified = true,
  rating,
  productImage
}: ReviewCardProps) {
  return (
    <div className="bg-[#e8eddf]  p-5  border border-[#d8e2dc]">
      <h3 className="text-[15px] font-medium text-[#242423] uppercase mb-5">
        {productName}
      </h3>
      
      {productImage && (
        <div className="flex mb-5">
          <div className="relative w-16 h-16">
            <Image
              src={productImage}
              alt={productName}
              fill
              className="object-contain"
            />
          </div>
          <div className="ml-4 flex-1 flex items-center">
            <p className="text-[#333533] text-sm">{productDescription}</p>
          </div>
        </div>
      )}
      
      {!productImage && (
        <p className="text-[#333533] text-sm mb-5">{productDescription}</p>
      )}
      
      <div className="flex items-center mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <FaStar 
            key={i} 
            className={`h-3.5 w-3.5 ${i < rating ? 'text-[#F5CB5C]' : 'text-gray-300'}`} 
          />
        ))}
      </div>
      
      <div className="flex items-center justify-between text-xs border-t border-gray-200 pt-3 mt-3">
        <div>
          <span className="font-medium text-[#333533]">{reviewerName}</span>
          {verified && (
            <span className="ml-2 text-[#5A5A46] text-xs">
              Verified Buyer
            </span>
          )}
        </div>
        <span className="text-gray-500">{date}</span>
      </div>
    </div>
  );
} 