import { products } from '../../data/products';
import ProductGrid from '../../components/products/ProductGrid';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Filter products by category if category param exists
  const categoryParam = searchParams.category as string | undefined;
  
  const filteredProducts = categoryParam
    ? products.filter((product) => product.category === categoryParam)
    : products;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
        {categoryParam
          ? `${categoryParam.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Coffee`
          : 'All Products'}
      </h1>
      
      {filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <p className="text-gray-500">No products found in this category.</p>
      )}
    </div>
  );
} 