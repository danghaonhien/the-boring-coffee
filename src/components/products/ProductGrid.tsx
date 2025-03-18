'use client';

import { Product } from '../../types/database.types';
import ProductCard from './ProductCard';

type ProductGridProps = {
  products: Product[];
};

export default function ProductGrid({ products }: ProductGridProps) {
  // If not enough products to fill a row, let them take more space
  const gridColsClass = products.length < 3 
    ? 'grid-cols-1 sm:grid-cols-2' 
    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  
  return (
    <div className={`grid ${gridColsClass} gap-6 gap-y-12`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
} 