'use client';

import Image from 'next/image';

interface ProductStoryProps {
  story: string;
  productName: string;
}

export default function ProductStory({ story, productName }: ProductStoryProps) {
  // Based on product name, choose the right story image
  const storyImagePath = `/images/story/${productName.toLowerCase().replace(/\s+/g, '-')}-story.jpg`;
  const farmImagePath = `/images/story/${productName.toLowerCase().replace(/\s+/g, '-')}-farm.jpg`;
  
  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold text-[#242423] mb-8 text-center">The Story</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
        <div className="rounded-lg overflow-hidden">
          <Image
            src={storyImagePath}
            alt={`${productName} Coffee Story`}
            width={600}
            height={400}
            className="w-full h-auto object-cover rounded-lg"
            unoptimized
          />
        </div>
        <div>
          <p className="text-[#333533] text-lg leading-relaxed">{story}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="order-2 lg:order-1">
          <div className="bg-[#CFDBD5]/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-[#242423] mb-4">From Farm to Cup</h3>
            <p className="text-[#333533] leading-relaxed">
              We carefully select and source our coffee beans from sustainable farms around the world, 
              ensuring fair compensation for farmers and environmentally responsible growing practices.
              Each batch is roasted in small quantities to maintain the highest quality and freshness.
            </p>
          </div>
        </div>
        <div className="order-1 lg:order-2 rounded-lg overflow-hidden">
          <Image
            src={farmImagePath}
            alt="Coffee Farm"
            width={600}
            height={400}
            className="w-full h-auto object-cover rounded-lg"
            unoptimized
          />
        </div>
      </div>
    </div>
  );
} 