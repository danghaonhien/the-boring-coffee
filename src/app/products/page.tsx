import { Suspense } from 'react';
import Link from 'next/link';
import ProductGrid from '../../components/products/ProductGrid';
import Loading from '../../components/ui/Loading';
import { Product } from '../../types/database.types';
import { syncProductsToSupabase, getAllProducts } from '../../lib/api/products';

export const revalidate = 3600; // Revalidate every hour

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const selectedCategory = 
    typeof searchParams.category === 'string' ? searchParams.category : undefined;
  
  // Fetch products from Supabase
  let products: Product[] = [];
  let connectionError: string | null = null;
  
  try {
    // First try to ensure data sync
    await syncProductsToSupabase();
    
    // Get products from Supabase
    products = await getAllProducts();
    
    if (!products || products.length === 0) {
      throw new Error("No products found in database.");
    }
    
    console.log(`Retrieved ${products.length} products for product listing`);
  } catch (error) {
    console.error('Error fetching products:', error);
    // Fallback to local data
    products = await import('../../data/products').then(m => m.products);
    connectionError = error instanceof Error ? error.message : "Connection error. Using sample data instead.";
  }

  // Filter products by category if a category is selected
  const filteredProducts = selectedCategory
    ? products.filter(product => product.category === selectedCategory)
    : products;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-extrabold text-[#242423] mb-8">Our Products</h1>
      
      {connectionError && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded shadow-sm">
          <p className="font-medium">Supabase Connection Issue</p>
          <p className="text-sm">{connectionError}</p>
          <p className="text-sm mt-2">To fix this, please follow the instructions in the README.md file to properly set up Supabase.</p>
        </div>
      )}
      
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-start gap-2 sm:gap-4">
          <Link 
            href="/products" 
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              !selectedCategory
                ? 'bg-[#333533] text-white'
                : 'bg-[#E8EDDF] text-[#333533] hover:bg-[#CFDBD5]'
            } transition-colors`}
          >
            All
          </Link>
          <Link 
            href="/products?category=coffee" 
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              selectedCategory === 'coffee'
                ? 'bg-[#333533] text-white'
                : 'bg-[#E8EDDF] text-[#333533] hover:bg-[#CFDBD5]'
            } transition-colors`}
          >
            Coffee
          </Link>
          <Link 
            href="/products?category=coffee-kit" 
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              selectedCategory === 'coffee-kit'
                ? 'bg-[#333533] text-white'
                : 'bg-[#E8EDDF] text-[#333533] hover:bg-[#CFDBD5]'
            } transition-colors`}
          >
            Equipment
          </Link>
        </div>
      </div>
      
      <Suspense fallback={<Loading />}>
        <ProductGrid products={filteredProducts} />
      </Suspense>
    </div>
  );
} 