'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../../types/database.types';
import { formatPrice } from '../../lib/utils';

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative bg-white rounded-lg shadow-sm overflow-hidden">
      <Link href={`/products/${product.id}`} className="block">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
          <Image
            src={product.image_url}
            alt={product.name}
            width={500}
            height={500}
            className="w-full h-full object-center object-cover group-hover:opacity-75"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
          <p className="mt-2 text-lg font-medium text-gray-900">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </div>
  );
} 