'use client';

import { Product } from '../../types/database.types';
import ProductCard from './ProductCard';

type ProductGridProps = {
  products: Product[];
};

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
      {products.map((product, index) => (
        <div 
          key={product.id} 
          className={index === 0 ? "col-span-2 md:col-span-2 lg:col-span-1" : "col-span-1"}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
} 