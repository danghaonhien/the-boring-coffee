import Image from 'next/image';
import { notFound } from 'next/navigation';
import { products } from '../../../data/products';
import { formatPrice } from '../../../lib/utils';
import AddToCartButton from '../../../components/products/AddToCartButton';

type ProductPageProps = {
  params: {
    id: string;
  };
};

export default async function ProductPage({ params }: ProductPageProps) {
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
          <Image
            src={product.image_url}
            alt={product.name}
            width={600}
            height={600}
            className="w-full h-full object-center object-cover"
          />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">{product.name}</h1>
          <p className="mt-4 text-2xl text-gray-900">{formatPrice(product.price)}</p>
          <div className="mt-6">
            <h2 className="text-lg font-medium text-gray-900">Description</h2>
            <p className="mt-2 text-gray-600">{product.description}</p>
          </div>
          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8">
            <h2 className="text-lg font-medium text-gray-900">Details</h2>
            <div className="mt-4 space-y-4">
              <div className="flex">
                <span className="w-1/3 text-gray-500">Category</span>
                <span className="w-2/3 text-gray-900 capitalize">
                  {product.category.split('-').join(' ')}
                </span>
              </div>
              <div className="flex">
                <span className="w-1/3 text-gray-500">Stock</span>
                <span className="w-2/3 text-gray-900">{product.stock} available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 