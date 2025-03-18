'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type CategoryTabsProps = {
  categories: { id: string; label: string }[];
};

export default function CategoryTabs({ categories }: CategoryTabsProps) {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');
  
  return (
    <div className="mb-8 border-b border-gray-200">
      <div className="flex overflow-x-auto py-2 hide-scrollbar">
        <Link 
          href="/products"
          className={`whitespace-nowrap px-4 py-2 mr-4 rounded-md text-sm font-medium transition-colors duration-200 ${
            !currentCategory 
              ? 'bg-amber-100 text-amber-800' 
              : 'text-gray-600 hover:text-amber-700'
          }`}
        >
          All Products
        </Link>
        
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.id}`}
            className={`whitespace-nowrap px-4 py-2 mr-4 rounded-md text-sm font-medium transition-colors duration-200 ${
              currentCategory === category.id 
                ? 'bg-amber-100 text-amber-800' 
                : 'text-gray-600 hover:text-amber-700'
            }`}
          >
            {category.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

// Add this to the global CSS file
export const globalStyles = `
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
`; 