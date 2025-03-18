import { products } from '../../data/products';
import ProductGrid from '../../components/products/ProductGrid';
import CategoryTabs from '../../components/products/CategoryTabs';

// Define available categories
const categories = [
  { id: 'coffee', label: 'Coffee' },
  { id: 'coffee-kit', label: 'Coffee Kit' },
];

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

  // Get the current category label for display
  const currentCategoryLabel = categoryParam
    ? categories.find(cat => cat.id === categoryParam)?.label || categoryParam.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'All Products';

  return (
    <div className="bg-[#E8EDDF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-display font-bold text-[#242423] mb-6">
          {currentCategoryLabel}
        </h1>
        
        <CategoryTabs categories={categories} />
        
        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <p className="text-[#333533]">No products found in this category.</p>
        )}
      </div>
    </div>
  );
} 